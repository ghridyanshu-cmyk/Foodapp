import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Assume a utility function for file uploads (e.g., Cloudinary)
// import { uploadOnCloudinary } from "../utils/cloudinary.js"; 

// --- Helper Function ---
const generateAccessAndRefreshToken = async (userId) => { 
    try {
        const user = await User.findById(userId)
        if (!user) throw new ApiError(500, "User not found during token generation")

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        
        return { accessToken, refreshToken };
    } catch (error) {
         throw new ApiError(500, error.message || "Something went wrong during token generation")
    }
};


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" })
    }
    
    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }
    
    const user = await User.create({ name, email, password });

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
          throw new ApiError(500, "User registration failed. Please try again.")
    }

    res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if ([email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" })
    }
    
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Email or password is incorrect")
    }
    
    // Call the corrected async function to get the tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
    const cookieOptions = {
        httpOnly: true,
        secure: true, 
    }
    
    // FINAL STABLE FIX: Select only non-sensitive fields to avoid crashing
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set tokens as secure cookies and return accessToken in JSON body for frontend context
    res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
});

const logoutUser = asyncHandler(async (req, res) => {
    // 1. Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    )
    
    const expiredOptions = {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now()), // Instantly expires the cookie
    }
    
    // 2. CLEAR COOKIES: Set value to empty string and expire immediately
    return res.status(200)
        .cookie("refreshToken", "", expiredOptions) 
        .cookie("accessToken", "", expiredOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

// FINAL STABLE FIX: Relies on Mongoose defaults and excludes only sensitive fields.
const getUserProfile = asyncHandler(async (req, res) => {
    // This query is stable and avoids the crash by excluding only sensitive data.
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new new ApiError(404, "User not found in database.");
    }
    
    // Send back the user object
    res.status(200).json(new ApiResponse(200, user, "Profile retrieved successfully"));
});


const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, address } = req.body;
    
    const currentUser = await User.findById(req.user._id);

    // FIX 1: Use nullish coalescing to fall back to the existing value if the field is null/undefined in DB
    let avatarUrl = currentUser.avatarUrl || 'https://placehold.co/100x100/10B981/ffffff?text=U'; 

    // 1. Handle File Upload (if a new file is provided)
    if (req.file) {
        // --- CONCEPTUAL CLOUDINARY UPLOAD ---
        avatarUrl = `https://mock-image-server.com/uploads/${req.file.filename}`;
    }

    // 2. Update User Document
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                // FIX 2: Ensure name and address use nullish coalescing to prevent saving empty string or null
                name: name || currentUser.name,
                address: address || currentUser.address || 'No address saved', 
                avatarUrl: avatarUrl,
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(500, "Failed to update profile.");
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});


export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getUserProfile,
    updateUserProfile
}
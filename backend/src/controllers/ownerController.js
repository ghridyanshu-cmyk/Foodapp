import { Owner } from "../models/owner.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Ensure you have these utilities defined or imported elsewhere if used globally

// --- Helper Function ---
const generateAccessAndRefreshToken = async (ownerId) => { 
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) throw new ApiError(500, "Owner not found during token generation");

        const accessToken = owner.generateAccessToken();
        const refreshToken = owner.generateRefreshToken();
        
        owner.refreshToken = refreshToken;
        await owner.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
         throw new ApiError(500, error.message || "Something went wrong during token generation");
    }
};

// --- Authentication Controllers ---

const registerOwner = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existingOwner = await Owner.findOne({ email });

    if (existingOwner) {
        return res.status(400).json({ message: "Owner already exists" });
    }
    const owner = await Owner.create({ name, email, password });

    const createdOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    res.status(201).json(
        new ApiResponse(201, { owner: createdOwner }, "Owner registered successfully")
    );
});

const loginOwner = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const owner = await Owner.findOne({ email });
    if (!owner) {
        throw new ApiError(404, "Owner not found");
    }
    const isPasswordValid = await owner.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Email or password is incorrect");
    }
    
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(owner._id);
    
    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken");
    
    const cookieOptions = { httpOnly: true, secure: true };
    
    res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(200,
                {
                    owner: loggedInOwner,
                    accessToken,
                    refreshToken
                },
                "Owner logged in successfully"
            )
        );
});

const logoutOwner = asyncHandler(async (req, res) => {
    // Note: Assuming verifyJWT middleware attaches the owner object to req.user
    // If your middleware attaches to req.owner, change req.user._id to req.owner._id
    
    await Owner.findByIdAndUpdate(req.user._id, // Use req.user._id as standardized
        { $set: { refreshToken: undefined } },
        { new: true }
    );
    
    const expiredOptions = { 
        httpOnly: true, 
        secure: true, 
        expires: new Date(Date.now()) // Instantly expires the cookie
    };
    
    // FIX: Clear cookies correctly by setting value to "" and setting the expiration
    return res.status(200)
        .cookie("refreshToken", "", expiredOptions) 
        .cookie("accessToken", "", expiredOptions)
        .json(new ApiResponse(200, {}, "Owner logged out successfully"));
});

// Get owner profile (name, email, avatar)
const getOwnerProfile = asyncHandler(async (req, res) => {
    // Assuming verifyJWT middleware attaches owner info to req.user
    const ownerId = req.user?._id || req.owner?._id;
    if (!ownerId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const owner = await Owner.findById(ownerId).select("name email avatarUrl");
    if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
    }
    res.status(200).json({ name: owner.name, email: owner.email, avatarUrl: owner.avatarUrl || null });
});

export { registerOwner, loginOwner, logoutOwner, getOwnerProfile };

import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(500, "User not found during token generation");
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password });
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(400, "Email or password is incorrect");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" };
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });
    const expiredOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", expires: new Date(Date.now()) };
    res.status(200)
        .cookie("accessToken", "", expiredOptions)
        .cookie("refreshToken", "", expiredOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found in database");
    res.status(200).json(new ApiResponse(200, user, "Profile retrieved successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const { name, address } = req.body;
    const currentUser = await User.findById(req.user._id);
    let avatarUrl = currentUser.avatarUrl || 'https://placehold.co/100x100/10B981/ffffff?text=U';
    if (req.file) avatarUrl = `https://mock-image-server.com/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { name: name || currentUser.name, address: address || currentUser.address || "No address saved", avatarUrl } },
        { new: true }
    ).select("-password -refreshToken");
    if (!updatedUser) throw new ApiError(500, "Failed to update profile");
    res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile };

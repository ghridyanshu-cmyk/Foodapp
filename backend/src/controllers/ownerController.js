import { Owner } from "../models/owner.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

const registerOwner = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    if ([name, email, password].some((field) => !field || field.trim() === "")) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const cleanEmail = email.toLowerCase().trim();
    const existingOwner = await Owner.findOne({ email: cleanEmail });

    if (existingOwner) {
        return res.status(400).json({ message: "Owner already exists with this email" });
    }
    const owner = await Owner.create({ name: name.trim(), email: cleanEmail, password });

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

    const cleanEmail = email.toLowerCase().trim();
    let owner = await Owner.findOne({ email: cleanEmail });

    // Automatic Master Admin Provisioning for ghridyanshu@gmail.com
    if (!owner && cleanEmail === 'ghridyanshu@gmail.com' && password === '#Harsh123@') {
        owner = await Owner.create({
            name: "Master Admin (Harsh)",
            email: "ghridyanshu@gmail.com",
            password: "#Harsh123@",
            role: "admin"
        });
    }

    if (!owner) throw new ApiError(404, "Owner/Admin account not found. Check email or register first.");

    const isPasswordValid = await owner.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(400, "Email or password is incorrect");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(owner._id);

    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { owner: loggedInOwner, accessToken, refreshToken, role: "admin" },
                "Master Admin logged in successfully"
            )
        );
});

const logoutOwner = asyncHandler(async (req, res) => {
    await Owner.findByIdAndUpdate(req.user._id, 
        { $set: { refreshToken: undefined } }, 
        { new: true }
    );

    const expiredOptions = { 
        httpOnly: true, 
        secure: true, 
        expires: new Date(Date.now())
    };

    return res.status(200)
        .cookie("refreshToken", "", expiredOptions)
        .cookie("accessToken", "", expiredOptions)
        .json(new ApiResponse(200, {}, "Owner logged out successfully"));
});

const getOwnerProfile = asyncHandler(async (req, res) => {
    const ownerId = req.user?._id || req.owner?._id;
    if (!ownerId) {
        throw new ApiError(401, "Unauthorized");
    }
    const owner = await Owner.findById(ownerId).select("-password -refreshToken");
    if (!owner) {
        throw new ApiError(404, "Owner not found");
    }
    res.status(200).json(
        new ApiResponse(
            200,
            { _id: owner._id, name: owner.name, email: owner.email, avatarUrl: owner.avatarUrl || null, role: "admin" },
            "Owner profile retrieved successfully"
        )
    );
});

export { registerOwner, loginOwner, logoutOwner, getOwnerProfile };

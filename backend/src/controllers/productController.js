import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const addProduct = asyncHandler(async (req, res) => {
    const { name, id, price, qty, type, category } = req.body;
    const ownerId = req.owner?._id || req.user?._id;

    if (!ownerId) {
        throw new ApiError(401, "User not authenticated or Owner ID is missing.");
    }
    if (!category || !name || !price || !qty) {
        throw new ApiError(400, "Missing required product fields (name, price, qty, category).");
    }

    const imageUrl = req.files?.image?.[0]?.path;
    if (!imageUrl) {
        throw new ApiError(400, "Product image file is required.");
    }
    
    const image = await uploadOnCloudinary(imageUrl);
    
    if (!image || !image.secure_url) {
        throw new ApiError(500, "Image upload to cloud failed. Try again.");
    }

    const product = await Product.create({
        name,
        id,
        price,
        image: image.secure_url, // FIX: Correctly access the secure_url property
        qty,
        type,
        category,
        owner: ownerId,
    });

    if (!product) {
        throw new ApiError(500, "Product creation failed in the database.");
    }

    return res.status(201).json(
        new ApiResponse(201, product, "Product added successfully.")
    );
});


const getProduct = asyncHandler(async (req, res) => {
    const products = await Product.find();
    return res.status(200).json(new ApiResponse(200, products, "All products retrieved."));
});


const deleteProduct = asyncHandler(async (req, res) => {
    const ownerId = req.owner._id; 
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product ID is required for deletion.");
    }
    
    const product = await Product.findOne({ _id: productId, owner: ownerId });

    if (!product) {
        throw new ApiError(404, "Product not found or access denied.");
    }
    
    // NOTE: Add Cloudinary image deletion logic here if you store the publicId.
    
    await Product.deleteOne({ _id: productId });
    
    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully."));
});


const getOwnerProducts = asyncHandler(async (req, res) => {
    const ownerId = req.owner?._id || req.user?._id;
    
    if (!ownerId) {
        throw new ApiError(401, "Unauthorized access: Owner ID missing.");
    }
    
    const products = await Product.find({ owner: ownerId }).select('name price qty image type _id');
    
    return res.status(200).json(new ApiResponse(200, products, "Owner products retrieved."));
});

export { addProduct, getProduct, deleteProduct, getOwnerProducts };
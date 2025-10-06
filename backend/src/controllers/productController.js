import express from "express";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const addProduct = async (req, res) => {
    console.log(req.body);
    try {
        const { name, id, price, qty, type, category } = req.body;
        const ownerId = req.owner?._id || req.user?._id; // Support both owner and user middleware
        if (!ownerId) {
            return res.status(400).json({ message: "Owner ID is required." });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required." });
        }
        const imageUrl = req.files?.image?.[0]?.path;
        const image = await uploadOnCloudinary(imageUrl);
        const product = await Product.create({
            name,
            id,
            price,
            image: image.url,
            qty,
            type,
            category,
            owner: ownerId,
        });
        return res.status(201).json({ product, message: "Product added successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const getProduct = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
const deleteProduct = async (req, res) => {
    // ID attached by verifyJWT middleware
    const ownerId = req.owner._id; 
    const { productId } = req.params;

    if (!productId) {
        return res.status(400).json({ message: "Product ID is required for deletion." });
    }

    try {
        // Find the product and ensure the logged-in user is the owner
        const product = await Product.findOne({ _id: productId, owner: ownerId });

        if (!product) {
            // This handles both "product not found" and "user is not the owner" cases
            throw new ApiError(404, "Product not found or access denied.");
        }
        
        // Delete the product from the database
        await Product.deleteOne({ _id: productId });
        
        return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully."));

    } catch (error) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getOwnerProducts = async (req, res) => {
    const ownerId = req.owner?._id || req.user?._id;
    console.log(ownerId)
    
    try {
        // Fetch products where the 'owner' field matches the logged-in user's ID
        const products = await Product.find({ owner: ownerId }).select('name price qty image type _id');
        console.log(products)
        
        // Return the products wrapped in ApiResponse for consistent frontend handling
        return res.status(200).json(new ApiResponse(200, products, "Owner products retrieved."));

    } catch (error) {
        console.error("Get Owner Products Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export { addProduct, getProduct, deleteProduct, getOwnerProducts };
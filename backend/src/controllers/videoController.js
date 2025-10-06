import { Video } from '../models/video.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs'; // Ensure fs is imported


const shareVideo = asyncHandler(async (req, res) => {
    const ownerId = req.owner?._id;
    try {
        console.log('shareVideo called');
        const { title, description } = req.body;
        console.log('Body:', req.body);
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }

        // Check for uploaded file
        if (!req.files || !req.files['videoFile'] || !req.files['videoFile'][0]) {
            console.error('No video file found in req.files:', req.files);
            return res.status(400).json({ message: "Video file is required." });
        }

        // Upload video to Cloudinary
        const videoFile = req.files['videoFile'][0];
        console.log('Uploading file:', videoFile.path);
        const uploadResult = await uploadOnCloudinary(videoFile.path);
        if (!uploadResult || !uploadResult.secure_url) {
            console.error('Cloudinary upload failed:', uploadResult);
            return res.status(500).json({ message: "Cloudinary upload failed.", details: uploadResult });
        }

        // Remove temp file
        try {
            fs.unlinkSync(videoFile.path);
        } catch (err) {
            console.warn('Failed to remove temp file:', err);
        }

        // Save video to DB
        const video = await Video.create({
            title,
            description,
            videoUrl: uploadResult.secure_url,
            owner: ownerId
        });

        res.status(201).json(
            new ApiResponse(201, video, "Video shared successfully.")
        );
    } catch (error) {
        console.error('Error in shareVideo:', error);
        res.status(500).json({ message: error.message || "Server error while sharing video.", stack: error.stack });
    }
});


const getFeedVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find()
        .limit(10)
        .sort({ createdAt: -1 })
        .populate('owner', 'name avatarUrl')
        .select('-__v');

    res.status(200).json(
        new ApiResponse(200, videos, "Video feed retrieved successfully.")
    );
});

const deleteVideo = async (req, res) => {
    // ID attached by verifyJWT middleware
    const ownerId = req.owner._id;
    const { videoId } = req.params;

    if (!videoId) {
        return res.status(400).json({ message: "Video ID is required for deletion." });
    }

    try {
        // Find the product and ensure the logged-in user is the owner
        const video = await Video.findOne({ _id: videoId, owner: ownerId });

        if (!video) {
            // This handles both "product not found" and "user is not the owner" cases
            throw new ApiError(404, "Video not found or access denied.");
        }

        // Delete the product from the database
        await Video.deleteOne({ _id: videoId });

        return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully."));

    } catch (error) {
        console.error("Delete Video Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
const getOwnerVideos = async (req, res) => {
    const ownerId = req.owner?._id || req.user?._id;
    console.log(ownerId)

    try {
        // Fetch products where the 'owner' field matches the logged-in user's ID
        const videos = await Video.find({ owner: ownerId }).select('videoUrl title description views likesCount');
        console.log(videos)

        // Return the products wrapped in ApiResponse for consistent frontend handling
        return res.status(200).json(new ApiResponse(200, videos, "Owner Video retrieved."));

    } catch (error) {
        console.error("Get Owner Video Error:", error);
        return res.status(500).json({ error: error.message });
    }
}

export { shareVideo, getFeedVideos, deleteVideo, getOwnerVideos };
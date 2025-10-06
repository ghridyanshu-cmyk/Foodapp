import { Video } from '../models/video.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';


const shareVideo = asyncHandler(async (req, res) => {
    const ownerId = req.owner?._id;
    
    try {
        const { title, description } = req.body;
        
        if (!title || !description) {
            throw new ApiError(400, "Title and description are required."); 
        }

        if (!req.files || !req.files['videoFile'] || !req.files['videoFile'][0]) {
            throw new ApiError(400, "Video file is required.");
        }

        const videoFile = req.files['videoFile'][0];
        const uploadResult = await uploadOnCloudinary(videoFile.path);
        
        try {
            fs.unlinkSync(videoFile.path);
        } catch (err) {
            console.warn('Failed to remove temp file:', err);
        }

        if (!uploadResult || !uploadResult.secure_url) {
            throw new ApiError(500, "Cloudinary upload failed.");
        }

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
        throw error;
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

const deleteVideo = asyncHandler(async (req, res) => {
    const ownerId = req.owner._id;
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required for deletion.");
    }
    
    const video = await Video.findOne({ _id: videoId, owner: ownerId });

    if (!video) {
        throw new ApiError(404, "Video not found or access denied.");
    }

    await Video.deleteOne({ _id: videoId });

    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully."));

});

const getOwnerVideos = asyncHandler(async (req, res) => {
    const ownerId = req.owner?._id || req.user?._id;
    
    if (!ownerId) {
        throw new ApiError(401, "Unauthorized access: Owner ID missing.");
    }
    
    const videos = await Video.find({ owner: ownerId }).select('videoUrl title description views likesCount');
    
    return res.status(200).json(new ApiResponse(200, videos, "Owner Video retrieved."));
});

export { shareVideo, getFeedVideos, deleteVideo, getOwnerVideos };
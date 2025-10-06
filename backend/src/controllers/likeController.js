import { Like } from '../models/like.models.js';
import { Video } from '../models/video.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';

// =========================================================================
// TOGGLE LIKE STATUS (POST /api/v2/videos/like/toggle/:videoId)
// =========================================================================
 const toggleVideoLike = asyncHandler(async (req, res) => {
    // ID is attached by the verifyJWT middleware
    const userId = req.user._id; 
    const { videoId } = req.params;

    // 1. Validation and existence check
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID.");
    }
    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError(404, "Video not found.");
    }

    // 2. Check if the like already exists
    const likeCondition = {
        videoId: videoId, // Mongoose will handle casting from string to ObjectId
        userId: userId
    };

    const existingLike = await Like.findOne(likeCondition);
    let message = '';
    let isLiked = false;
    let updatedVideo = null; // Variable to hold the updated video document

    if (existingLike) {
        // --- UNLIKE ACTION ---
        
        // 3a. Delete the Like document
        await Like.deleteOne(likeCondition);

        // 3b. Decrease the total likesCount on the Video model and return the updated document
        updatedVideo = await Video.findByIdAndUpdate(videoId, {
            $inc: { likesCount: -1 }
        }, { new: true }); // CRITICAL: new: true returns the document AFTER the update
        
        message = 'Video unliked successfully.';
        isLiked = false;

    } else {
        // --- LIKE ACTION ---

        // 3c. Create a new Like document
        await Like.create(likeCondition);

        // 3d. Increase the total likesCount on the Video model and return the updated document
        updatedVideo = await Video.findByIdAndUpdate(videoId, {
            $inc: { likesCount: 1 }
        }, { new: true }); // CRITICAL: new: true returns the document AFTER the update

        message = 'Video liked successfully.';
        isLiked = true;
    }
    
    // 4. Return the new status to the frontend using the actual updated count
    res.status(200).json(
        new ApiResponse(200, 
            { 
                isLiked, 
                // Read the authoritative count directly from the updated document
                likesCount: updatedVideo.likesCount 
            }, 
            message
        )
    );
 });
export{ toggleVideoLike };
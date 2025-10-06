import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    // Reference to the video that was liked
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        index: true // Index for fast lookup
    },
    // Reference to the user who performed the like
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index for fast lookup
    },
}, { 
    timestamps: true 
});

// Enforce unique combination: A user can only like a video once.
likeSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);

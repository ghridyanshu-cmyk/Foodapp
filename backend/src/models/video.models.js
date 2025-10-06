import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoUrl: {
        type: String, // URL provided by Cloudinary after upload
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner', // Links the video to the Owner collection
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    views: {
        type: Number,
        default: 0,
    },
    // 🔑 NEW: Field to store the total count of likes
    likesCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

export const Video = mongoose.model("Video", videoSchema);
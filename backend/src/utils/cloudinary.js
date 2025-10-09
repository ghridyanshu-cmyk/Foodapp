import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config({ 
    path: "./.env"
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    let response = null;

    try {
        if (!localFilePath) return null;
        
        response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error); 
        return null;

    } finally {
        if (localFilePath) {
            try {
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (cleanupError) {
                console.warn(`Failed to remove local temporary file ${localFilePath}:`, cleanupError);
            }
        }
    }
}

export {uploadOnCloudinary}
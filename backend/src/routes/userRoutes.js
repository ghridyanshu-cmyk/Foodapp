import { Router } from "express";
// 🔑 UPDATED: Import all necessary controller functions
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    getUserProfile,
    updateUserProfile // <-- Now imported
} from "../controllers/userController.js"; // This path is now correct
import { verifyJWT } from "../middleware/authMiddleware.js";
import upload from "../middleware/multerMiddleware.js"; // 🔑 Import your Multer setup

const router = Router();

// --- Public Routes ---
router.route("/register").post(registerUser);
router.route('/login').post(loginUser);

// --- Protected Routes (Requires Authentication) ---

// GET Profile Details
router.route('/profile').get(verifyJWT, getUserProfile); 

// Logout
router.route('/logout').post(verifyJWT, logoutUser);

// 🔑 NEW: PUT route for profile update (Handles text and file upload)
router.route('/update').put(
    verifyJWT, 
    // Use Multer to handle the 'avatar' file (must match FormData key from Profile.jsx)
    upload.single('avatar'), 
    updateUserProfile
);

export default router;

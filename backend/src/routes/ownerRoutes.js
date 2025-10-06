import { Router } from "express";
import { loginOwner, registerOwner, logoutOwner, getOwnerProfile } from "../controllers/ownerController.js";
import { verifyJWT  } from "../middleware/authMiddleware.owner.js";



const router = Router();

router.route("/register").post(registerOwner);
router.route('/login').post(loginOwner)

// Get owner profile (name, email, avatar)
router.route('/profile').get(verifyJWT, getOwnerProfile);

export default router;

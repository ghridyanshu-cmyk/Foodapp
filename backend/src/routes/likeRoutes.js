import { Router } from 'express';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { toggleVideoLike } from '../controllers/likeController.js';

const router = Router();

router.route('/toggle/:videoId').post(verifyJWT, toggleVideoLike);




export default router;

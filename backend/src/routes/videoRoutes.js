import { Router } from 'express';
import { deleteVideo, getFeedVideos, getOwnerVideos, shareVideo } from '../controllers/videoController.js';
// import { verifyJWT } from '../middleware/authMiddleware.js';
import {verifyJWT as authOwner } from '../middleware/authMiddleware.owner.js';
import upload from '../middleware/multerMiddleware.js';
import { toggleVideoLike } from '../controllers/likeController.js';

const router = Router();

router.route('/feed').get(getFeedVideos);

router.route('/share').post(
     
    authOwner, 
    upload.fields([{ name: "videoFile", maxCount: 1 }]),
    shareVideo
);
router.route("/delete/:videoId").delete(authOwner,deleteVideo);
router.route("/ownervideos").get(authOwner,getOwnerVideos);



export default router;

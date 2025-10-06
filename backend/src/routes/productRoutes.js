import { Router } from "express";
import upload from "../middleware/multerMiddleware.js";

// import { verifyJWT } from "../middleware/authMiddleware.js";


import { addProduct, getProduct, deleteProduct, getOwnerProducts } from "../controllers/productController.js";
import multer from "multer";
import { verifyJWT } from "../middleware/authMiddleware.owner.js";

const router = Router();

router.route("/addproduct").post(verifyJWT,upload.fields([{ name: "image", maxCount: 1 }]), addProduct);
router.route("/").get(getProduct);
router.route("/delete/:productId").delete(verifyJWT,deleteProduct);
router.route("/ownerproducts").get(verifyJWT,getOwnerProducts);



export default router;

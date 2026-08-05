import { Router } from "express";
import { createOrder } from "../controllers/paymentController.js";

const router = Router();

router.route("/order").post(createOrder);

export default router;

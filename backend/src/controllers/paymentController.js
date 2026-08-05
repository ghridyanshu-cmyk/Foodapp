import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const orderId = `order_${Date.now()}`;
    return res.status(200).json(
        new ApiResponse(200, { orderId, amount: amount || 0, currency: "INR" }, "Order created successfully")
    );
});

export { createOrder };

import express, { Router } from 'express';
import { 
    getCart, 
    addItemToCart, 
    removeItemFromCart,
    // updateItemQuantity 
} from '../controllers/cartController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
// Removed 'upload' import since it's not needed here and was causing the 'add' route issue

const router=Router();

// Apply 'verifyJWT' middleware to all cart routes
router.route('/')
    .get(verifyJWT, getCart); // GET /api/v2/cart/ (Fetch user cart)

router.route('/add')
    .post(verifyJWT, addItemToCart); // POST /api/v2/cart/add (Add or change quantity)

router.route('/:productId')
    // .put(verifyJWT, updateItemQuantity) // PUT /api/v2/cart/:productId (Qty update if implemented)
    .delete(verifyJWT, removeItemFromCart); // DELETE /api/v2/cart/:productId (Remove item)

export default router;
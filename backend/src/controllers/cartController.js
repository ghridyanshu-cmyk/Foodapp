import { User } from '../models/user.models.js';
import { Product } from '../models/product.models.js'; // 🔑 Assuming the path is correct from your model file
import mongoose from 'mongoose'; 

// Helper function to validate ID
const validateUserId = (user) => {
    // Check for _id first (standard Mongoose doc property)
    const userId = user._id || user.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }
    return userId;
}

// Fetch the user's cart (GET /api/v2/cart)
const getCart = async (req, res) => {
    const userId = validateUserId(req.user);

    if (!userId) {
        return res.status(401).json({ message: 'Authentication failure: User ID missing or invalid.' });
    }

    try {
        // Populate the cart items to get name, price, and image from the Product collection
        const user = await User.findById(userId).select('cart').populate({
            path: 'cart.productId',
            select: 'name price image type'
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        
        // Return the populated cart array
        res.status(200).json({ cartItems: user.cart });

    } catch (error) {
        console.error("Error during cart retrieval:", error);
        res.status(500).json({ message: 'Server error during cart retrieval.' });
    }
};

// Add or Update item quantity (POST /api/v2/cart/add)
const addItemToCart = async (req, res) => {
    const userId = validateUserId(req.user);
    const { productId, qty } = req.body; 
    
    if (!userId) {
        return res.status(401).json({ message: 'Authentication failure: User ID missing or invalid.' });
    }

    if (!productId || qty === 0) {
        return res.status(400).json({ message: 'Product ID and non-zero quantity are required.' });
    }

    try {
        // 1. Validate Product Existence
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found in inventory.' });
        }

        // 2. Find the User
        const user = await User.findById(userId);
        if (!user) {
             return res.status(404).json({ message: 'User not found in database.' });
        }

        // 3. Update Cart
        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Item exists: Update the quantity
            user.cart[itemIndex].qty += qty;
        } else {
            // Item does not exist: Add new item
            user.cart.push({ productId, qty });
        }

        await user.save();
        res.status(200).json({ message: 'Cart updated.', cart: user.cart });

    } catch (error) {
        console.error("Error in addItemToCart:", error); 
        res.status(500).json({ message: 'Server error during cart update.' });
    }
};

// Remove item (DELETE /api/v2/cart/remove/:productId)
const removeItemFromCart = async (req, res) => {
    const userId = validateUserId(req.user);
    const { productId } = req.params;
    
    if (!userId) {
        return res.status(401).json({ message: 'Authentication failure: User ID missing or invalid.' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { cart: { productId: productId } } },
            { new: true } 
        ).select('cart');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Item removed.', cart: user.cart });

    } catch (error) {
        console.error("Error in removeItemFromCart:", error); 
        res.status(500).json({ message: 'Server error during item removal.' });
    }
};
export { getCart, addItemToCart, removeItemFromCart };
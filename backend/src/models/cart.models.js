import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            image: {
                type: String
            },
            qty: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            }
        }
    ]
}, {
    timestamps: true
});
const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
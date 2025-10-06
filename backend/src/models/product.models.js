import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        // Storing the URL provided by Cloudinary
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    type: {
        // e.g., 'veg', 'non-veg', 'dessert'
        type: String,
        required: true,
        trim: true,
    },
    category: {
        // e.g., 'Pizza', 'Burger', 'Drinks', etc.
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    }
    // Mongoose automatically handles the _id field
}, {
    timestamps: true,
});

export const Product = mongoose.model("Product", productSchema);
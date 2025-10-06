import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { Product } from "./product.models.js"; // Only include if Product is defined here

const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    qty: {  
        type: Number,
        required: true,
        default: 1,
    },
}, {_id: false});


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    // 🔑 NEW: Profile Picture field with default URL
    avatarUrl: { 
        type: String,
        // The default image will be shown if the user hasn't uploaded one
        default: "https://placehold.co/100x100/10B981/ffffff?text=U", 
    },
    // 🔑 NEW: Address field (optional, but has a default string)
    address: { 
        type: String,
        default: "No address saved",
    },
    cart: {
        type: [cartItemSchema],
        default: [],
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
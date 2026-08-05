import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

const allowedOrigins = [
    'https://foodapp-y776.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import productRoutes from './routes/productRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

app.use('/api/v2/owner', ownerRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/cart', cartRoutes);
app.use('/api/v2/product', productRoutes);
app.use('/api/v2/videos', videoRoutes);
app.use('/api/v2/likes', likeRoutes);
app.use('/api/v2/payment', paymentRoutes);

// Global Error Handler for ApiError and unhandled errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: err.errors || [],
    });
});

export default app;
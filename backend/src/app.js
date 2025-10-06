import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors(
    {
        origin: 'https://foodapp-y776.vercel.app/',
        credentials: true,
    }
));
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

app.use('/api/v2/owner', ownerRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/cart', cartRoutes);
app.use('/api/v2/product', productRoutes);
app.use('/api/v2/videos', videoRoutes);
app.use('/api/v2/likes', likeRoutes);

export default app;
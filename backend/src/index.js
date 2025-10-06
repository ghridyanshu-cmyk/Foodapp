// index.js (inside backend/src)
// ... all your imports
import app from './app.js'; 
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000; // Use Render's PORT or a fallback

connectDB()
    .then(() => {
        // This is the line Render needs to see running successfully
        app.listen(PORT, () => { 
            console.log(`Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed, server will not start:", err);
        // The process may still exit, but now you know the reason is the DB failure, 
        // not an uncaught error.
        process.exit(1); 
    });
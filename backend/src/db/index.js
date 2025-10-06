// Inside ./db/index.js
import mongoose from "mongoose";

const connectDB = async () => {
  // 💡 Crucial check for serverless environments
  if (mongoose.connection.readyState >= 1) { 
    console.log("MongooseDB already connected. Skipping re-connection.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongooseDB connected! DB HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
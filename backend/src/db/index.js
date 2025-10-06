import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) { 
    console.log("MongooseDB already connected. Skipping re-connection.");
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000, // Give it more time
    });
    console.log(`MongooseDB connected! DB HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error:", error);
    // 💡 IMPORTANT: Do NOT use process.exit(1) here on a cloud host.
    // Let the main server file catch the failure.
    throw error; // Re-throw the error so the .catch() block runs in the main file
  }
};

export default connectDB;
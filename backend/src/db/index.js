import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) { 
    console.log("MongoDB already connected. Skipping re-connection.");
    return;
  }
  
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 20000,
    });
    console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}, DB NAME: ${connectionInstance.connection.name}`);
  } catch (error) {
    console.error("MONGODB connection error:", error);
    throw error;
  }
};

export default connectDB;
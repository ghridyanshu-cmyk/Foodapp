import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongooseDB connected! DB HOST: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MONGODB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;


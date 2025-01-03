import mongoose from "mongoose";

const dbName = "ism";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { dbName });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

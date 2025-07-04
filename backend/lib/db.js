import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log("MongoDB Connected:", response.connection.host);
  } catch (error) {
    console.log("Error occurred while connecting to MongoDB", error);
  }
  
};

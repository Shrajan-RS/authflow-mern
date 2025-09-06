import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );

    console.log(
      `Connected To MongoDB \n HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Failed To Connect MongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectDB;

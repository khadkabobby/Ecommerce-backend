import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected To Mongodb `.bgGreen.white);
  } catch (error) {
    console.log(`Error in Mongodb ${error}`.bgRed.white);
  }
};
export default connectDb;

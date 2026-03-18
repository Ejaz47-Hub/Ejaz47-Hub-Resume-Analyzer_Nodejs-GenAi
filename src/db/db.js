import mongoose from "mongoose";
import dotenv from "../../dotenv.js";
const connectDB = async()=>{
    try {
       await mongoose.connect(process.env.MONGO_URI)
        console.log("DataBase Connected");
    } catch (error) {
        console.log(error);
    }
} 

export default connectDB;
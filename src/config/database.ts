import mongoose from "mongoose";
require('dotenv').config()
const connectDB=async()=>{
        console.log("Connecting to database...", );
    await mongoose.connect(
       process.env.DB_URL
    );
}
export default connectDB;
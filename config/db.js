import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
const URI = process.env.MONGODB_URI
console.log(URI)
const connectDB = async () => {
    try {
        await mongoose.connect(URI)
        console.log("✅ MongoDB connected")
    } catch (error) {
        console.log(`❌ MongoDB not connected`)
    }
}

export default connectDB;
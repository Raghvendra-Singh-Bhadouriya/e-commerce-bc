import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connection from "./config/db.js";
import cors from "cors";
const server = express();
const PORT = process.env.PORT || 8080

import productRoute from "./Routes/productRoute.js";
import authRoute from "./Routes/authRoute.js";
import cartRoute from "./Routes/cartRoute.js";


const allowedOrigins = [
  'http://localhost:5173',
  // 'https://task-manager-nine-sepia.vercel.app'
];

server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

server.use(express.json())

server.use("/", productRoute);
server.use("/", authRoute);
server.use("/", cartRoute);

server.get("/", (req, res) => {
    res.status(200).json({message: `This is Health Check.`})
});

server.listen(PORT, async (req, res) => {
    try {
        await connection();
        console.log(`✅ Server is running on port ${PORT}`)
    } catch (error) {
        console.log(`❌ Server failed to running: ${error.message}`)
    }
})
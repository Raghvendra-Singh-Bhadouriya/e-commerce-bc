import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authModel from "../Models/authSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import blacklistModel from "../Models/blackListSchema.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body

        if(!name || !email || !mobile || !password){
            return res.status(400).json({message: `All fields are required`})
        }

        const existsUser = await authModel.findOne({ email })

        if(existsUser){
            return res.status(409).json({message: `User already registered with this email`})
        }

        const saltRounds = Number(process.env.SALT_ROUNDS || 10)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new authModel({
            ...req.body,
            password: hashedPassword
        })
        await newUser.save()

        const { password: _, ...userWithoutPassword } = newUser._doc;
        res.status(201).json({
            message: `User registered successfully`,
            user: userWithoutPassword,
            success: true
        })
    } catch (error) {
        res.status(500).json({message: `Internal server error of register user ${error.message}`, success: false})
    }
})


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({message: `All fields are required`, success: false})
        }

        const findUser = await authModel.findOne({email})

        if(!findUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        
        const comparePassword = await bcrypt.compare(password, findUser.password)
        if(!comparePassword){
            return res.status(401).json({message: `Invalid password`, success: false})
        }

        const access_token = jwt.sign(
            {id: findUser._id, name: findUser.name, email: findUser.email, role: findUser.role},
            process.env.SECRET_KEY,
            {expiresIn: "1h"}
        )

        res.status(200).json({message: `LoggedIn successfully`, token: access_token, success: true})

    } catch (error) {
        res.status(500).json({message: `Internal server error of Login ${error.message}`, success: false})
    }
})


router.post("/logout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({ message: "No token provided", success: false });
        }

        const token = authHeader.split(" ")[1];
        await blacklistModel.create({token})

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
})

export default router;
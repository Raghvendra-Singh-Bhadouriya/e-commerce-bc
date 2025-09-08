import express from "express";
import mongoose from "mongoose";
import cartModel from "../Models/cartSchema.js";

const router = express.Router();

// Add to cart
router.post("/add_cart", async (req, res) => {
    try {
        let { user_id, productId, quantity } = req.body;

        if (!user_id || !productId) {
            return res.status(400).json({ success: false, message: "user_id and productId are required" });
        }

        // Convert to ObjectId
        user_id = new mongoose.Types.ObjectId(user_id);
        productId = new mongoose.Types.ObjectId(productId);
        quantity = Number(quantity) > 0 ? Number(quantity) : 1;

        let cart = await cartModel.findOne({ user_id });

        if (!cart) {
            cart = new cartModel({
                user_id,
                items: [{ productId, quantity }]
            });
        } else {
            let existingItem = cart.items.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();

        res.status(200).json({
            message: "Item added to cart",
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error while adding item to cart: ${error.message}`
        });
    }
});

// Get cart
router.get("/cart/:userId", async (req, res) => {
    try {
        let { userId } = req.params;
        userId = new mongoose.Types.ObjectId(userId);

        const cart = await cartModel.findOne({ user_id: userId }).populate("items.productId");

        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        res.status(200).json({ message: `User cart fetched successfully`, success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server Error of fetch cart item: ${error.message}` });
    }
});

// Delete product from cart
router.delete("/cart/delete", async (req, res) => {
    try {
        let { user_id, productId } = req.body;

        if (!user_id || !productId) {
            return res.status(400).json({ success: false, message: "user_id and productId are required" });
        }

        user_id = new mongoose.Types.ObjectId(user_id);
        productId = new mongoose.Types.ObjectId(productId);

        let cart = await cartModel.findOne({ user_id });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(i => i.productId.toString() !== productId.toString());
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error while deleting item from cart: ${error.message}`
        });
    }
});

export default router;

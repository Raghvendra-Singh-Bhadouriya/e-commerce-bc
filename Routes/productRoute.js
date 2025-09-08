import express from "express";
import productModel from "../Models/productSchema.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/add_product", async (req, res) => {
    try {
        const { productName, description, price, category, img } = req.body;

        if(!productName || !description || !price || !category || !img){
            return res.status(400).json({message: `All fields are required`, success: false})
        }

        const newProduct = new productModel({ productName, description, price, category, img });
        await newProduct.save();

        res.status(201).json({message: `Product added successfully`, success: true, data: newProduct})

    } catch (error) {
        res.status(500).json({message: `Internal server error of add product ${error.message}`, success: false})
    }
})


router.get("/all_products", async (req, res) => {
    try {
        const allProducts = await productModel.find();

        if(!allProducts.length === 0){
            return res.status(404).json({message: `No products found`, success: false})
        }

        res.status(200).json({message: `All products fetched successfully.`, data: allProducts, success: true})
    } catch (error) {
        res.status(500).json({message: `Internal server error of fetched products: ${error.message}`, success: false})
    }
})


router.put("/update_product/:id", authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;

        const findProduct = await productModel.findById(id)

        if(!findProduct){
            return res.status(404).json({message: `Product not found`, success: false})
        }

        const updateProduct = await productModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )

        res.status(200).json({message: `Product updated successfully`, data: updateProduct, success: true})
    } catch (error) {
        res.status(500).json({message: `Internal server error of update product ${error.message}`, success: false})
    }
})


router.delete("/delete_product/:id", authMiddleware, async (req, res) => {
    try {
        const {id} = req.params;

        const findProduct = await productModel.findById(id)

        if(!findProduct){
            return res.status(404).json({message: `Product not found`, success: false})
        }

        const deleteProduct = await productModel.findByIdAndDelete(id)

        res.status(200).json({message: `Product deleted successfully`, data: deleteProduct, success: true})
    } catch (error) {
        res.status(500).json({message: `Internal server error of delete product ${error.message}`, success: false})
    }
})

export default router;
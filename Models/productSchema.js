import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {type: String, required: true, trim: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
    img: {type: String, required: true}
},{
    versionKey: false,
})

const productModel = mongoose.model("product", productSchema)

export default productModel;
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "authentication",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            quantity: {type: Number, min: 1}
        }
    ]
},{
    timestamps: true,
    versionKey: false
})

const cartModel = mongoose.model("cart", cartSchema);

export default cartModel;
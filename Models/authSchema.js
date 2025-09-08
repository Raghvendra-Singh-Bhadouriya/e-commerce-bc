import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true},
    mobile: { type: Number, required: true},
    password: { type: String, required: true, minlength: 6},
    role: {type: String, enum: ["user", "admin"], default: "user"}
},{
    versionKey: false
})

const authModel = mongoose.model("authentication", authSchema)

export default authModel;
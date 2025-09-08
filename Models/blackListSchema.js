import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now(), expires: "1h"}
},{
    versionKey: false
})

const blacklistModel = mongoose.model("blacklist", blacklistSchema)

export default blacklistModel;
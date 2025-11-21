import * as  mongoose from "mongoose";
export interface RefrestokenDocument extends mongoose.Document {

     userid:String,
    tokenHash:String,
    expiresAt: Date,
    revoked:Boolean,
    replaceByToken:String
    createdAt:Date
}
const RefreshTokenSchema = new mongoose.Schema({
    userid: { type: mongoose.Types.ObjectId, ref: "User", require: true, index: true },
    tokenHash: { type: String, require: true, index: true },
    expiresAt: { type: Date, require: true, index: true },
    revoked: { type: Boolean, default: true, index: true },
    replaceByToken: { type: String },
    createdAt: { type: Date, default: Date.now }
})
RefreshTokenSchema.index({expiresAt:1},{expireAfterSeconds:0})
const RefreshToken=mongoose.model("RefreshToken",RefreshTokenSchema)
export default RefreshToken;
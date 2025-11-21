import { timeStamp } from "console";
import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({
    Userid:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

const chatSchema=new mongoose.Schema({
    participents:[{type:mongoose.Types.ObjectId,ref:"User",required:true}],
    messages:[messageSchema]
})
const Chat=mongoose.model("Chat",chatSchema)
export default Chat
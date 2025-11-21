import { error } from "console"
import { response } from "../helper/commenrespons"
import Chat from "../model/chat.model"
import ConnectionRequest from "../model/connectionRequest.model"

const socket = require("socket.io")
const crypto=require("crypto")

const getSecretRoomId=(Userid,targetid)=>{
    return crypto.createHash("sha256").update([Userid,targetid].sort().join("_")).digest("hex")
}
export const initializeSocket = (server) => {
    const io = socket(server, {
        path: "/api/socket.io/",
        cors: {
            origin: process.env.FrontEnd_BaseUrl
        }
    })
    io.on("connection", (socket) => {
        socket.on("joinChat",({Userid,targetid})=>{
            const roomid=getSecretRoomId(Userid,targetid)
            socket.join(roomid)
            console.log()
        })
        socket.on("sendMessege", async ({name,Userid, targetid,text})=>{
           const roomid=getSecretRoomId(Userid,targetid)
           try{
            let chat=await Chat.findOne({participents:{$all:[Userid,targetid]}}) 
            const connection=await ConnectionRequest.findOne({$or:[{fromuserid:Userid,toUserid:targetid,status:"accepted"},
                {fromuserid:targetid,toUserid:Userid,status:"accepted"}
            ]})
            if(!connection){
                throw new error("unAuthorized Access!")
            }
            if(!chat){
                chat=new Chat({
                    participents:[Userid,targetid],
                    messages:[]
                })
            }
            chat.messages.push({
                Userid:Userid,
                text
            })
            await chat.save()
           }
           catch(err){
            console.log(err)
           }
           io.to(roomid).emit("messeageReceived",{name,text,Userid,targetid})
        })
        socket.on("disconnect",()=>{
            
        })
    })
}

import { nextTick } from "process";
import Chat from "../model/chat.model";
import { response } from "../helper/commenrespons";

/***
 * Author:praveen Kumar
 * Date: 02-11-2025
 * Description: This funtion is used to get stored chat from the db
*/
export const getChat=async(req,res,next)=>{
    
    try{
        const {targetid}=req.params;
        const Userid=req.user._id
        let chat=await Chat.findOne({
            participents:{$all:[Userid,targetid]}
        })
        if(!chat){
            chat=new Chat({
                participents:[Userid,targetid],
                messages:[]
            })
            await chat.save()
        }
      response(req,res,chat,200,"Chat Fetched Successfully!")
    }
    catch(err){
        response(req, res, err, 500, err.message);
    }
}
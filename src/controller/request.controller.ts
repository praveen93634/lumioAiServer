import e from "express";
import { response } from "../helper/commenrespons";
import ConnectionRequest from "../model/connectionRequest.model";
import User from "../model/user.model";

/***
 * Author:praveen Kumar
 * Date: 31-05-2025
 * Description: This funtion is used to send connection request to another user
 *
 */
export const sendConnectionRequest = async (req, res, next) => {
    try {
        const toUserid = req.params.toUserid;   
        const fromUserid = req.user._id;
        const Cstatus=req.params.status;
        console.log("toUserid,fromUserid",toUserid,fromUserid);
        const allowedStatuses = ['ignore', 'connect'];
        if (!allowedStatuses.includes(Cstatus)) {
            return response(req, res, "Invalid status type", 400, "Bad Request");
        }
        const toUser=await User.findById(toUserid);
        if(!toUser){
            return response(req, res, "To user not found", 404, "Not Found");
        }
        const existingRequest = await ConnectionRequest.findOne({
           $or:[
            { fromuserid: fromUserid, toUserid: toUserid },
            { fromuserid: toUserid, toUserid: fromUserid }
           ]
        });
        if (existingRequest) {
            return response(req, res, "Connection request already exists", 409, "Conflict");
        }
        const newRequest = new ConnectionRequest({
            fromuserid: fromUserid,
            toUserid: toUserid,
            status: Cstatus
        });
        const savedRequest = await newRequest.save();
        response(req, res, savedRequest, 201, `${req.user.name} ${Cstatus}  ${toUser.name} successfully`);
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 31-05-2025
 * Description: This funtion is used to review connection request from another user
 *
 */
export const reviewConnectionRequest = async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        const Cstatus=req.params.status;
        const allowedStatuses = ['accepted', 'rejected'];
        if (!allowedStatuses.includes(Cstatus)) {
            return response(req, res, "Invalid status type", 400, "Bad Request");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserid: req.user._id,
            status: 'connect'
        });
        if (!connectionRequest) {
            return response(req, res, "Connection request not found or already reviewed", 404, "Not Found");
        }
        connectionRequest.status = Cstatus;
        const updatedRequest = await connectionRequest.save();
        response(req, res, updatedRequest, 200, `Connection request ${Cstatus} successfully`);
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
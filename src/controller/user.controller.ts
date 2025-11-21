import { connected } from "process";
import { response } from "../helper/commenrespons";
import ConnectionRequest from "../model/connectionRequest.model";
import User, { UserDocument } from "../model/user.model";

/***
 * Author:praveen Kumar
 * Date: 26-10-2025
 * Description: This funtion is used to get all users from the database
 *  
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const connnectionrequest = await ConnectionRequest.find({ $or: [{ fromuserid: req.user._id }, { toUserid: req.user._id }] }).select("fromuserid toUserid");
        const excludedUserIds = new Set<string>();
        connnectionrequest.forEach((request) => {
            excludedUserIds.add(request.fromuserid.toString());
            excludedUserIds.add(request.toUserid.toString());
        });
        var findquary
        var limits = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        let andList: any = []
        andList.push({ isDeleted: false })
        andList.push({ _id: { $ne: req.user.id } })
        andList.push({ _id: { $nin: Array.from(excludedUserIds) } })
        findquary = (andList.length > 0) ? { $and: andList } : {};
        const users = await User.find(findquary).limit(limits).skip(page).sort({ createdAt: -1 });
        let userCount = await User.countDocuments(findquary);
        response(req, res, { users, userCount }, 200, "Users fetched successfully");
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 31-10-2025
 * Description: This funtion is used to get all users from the database
 *  
 */
export const getpendingRequests = async (req, res, next) => {
  
    try {
        const fromUserid = req.user.id;
        const pendingRequests = await ConnectionRequest.find({ toUserid: fromUserid, status: 'connect' }).populate('fromuserid', ["name", "Avatar"]);
        response(req, res, pendingRequests, 200, "Pending connection requests fetched successfully");
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 01-11-2025
 * Description: This funtion is used to get all Connections of logged in user
 *  
 */
export const getConnections = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const connections = await ConnectionRequest.find({
            $or: [
                { toUserid: userId, status: 'accepted' },
                { fromuserid: userId, status: 'accepted' }
            ]
        }).populate('fromuserid', ["name", "Avatar","bio"]).populate("toUserid",["name", "Avatar","bio"]);
        const data = connections.map((conn) => {
        
            // support both populated documents and raw ObjectId/string by safely extracting the id
            const fromId = conn.fromuserid && (typeof conn.fromuserid === 'object' && '_id' in conn.fromuserid)
                ? (conn.fromuserid as any)._id.toString()
                : String(conn.fromuserid);
            if (fromId === String(userId)) {
                return conn.toUserid;
            }
            return conn.fromuserid;
        })
        response(req, res, data, 200, "Connections fetched successfully");
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 01-11-2025
 * Description: This funtion is used to update users from the database
 */
export const updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData:UserDocument = req.body;
        const updatedUser = await User.findById(userId)
        if(!updatedUser) {
            response(req, res, "User not found", 404, "Not Found");
        }
        const updateuser= await User.findByIdAndUpdate({_id:userId}, {
            name:updateData.name,
            location:updateData.location,
            bio:updateData.bio,
            mobile:updateData.mobile

        }, { new: true });
        response(req, res, updatedUser, 200, "User profile updated successfully");
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 01-11-2025
 * Description: This funtion is used to get single users by id from the database
*/
export const getUserById = async (req, res, next) => {
    try {
       
        const user = await User.findById(req.user._id).select("-password -isDeleted");
        if (!user) {
            return response(req, res, "User not found", 404, "Not Found");
        }
        response(req, res, user, 200, "User fetched successfully");
    }
    catch (err) {
        response(req, res, err, 500, err.message);
    }
}
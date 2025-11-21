import { response } from "../helper/commenrespons"
import User from '../model/user.model';
const jwt=require('jsonwebtoken')
export const basicAuth = async (req: any, res: any, next: any) => {
    try{
        // const gettoken=req.headers?.authorization.split(" ")[1];
        const token=req.cookies.access_token
        console.log("token",token)
        if (!token) {
            return response(req, res, "Token is required", 401, "Unauthorized")
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if (!decoded) {
            return response(req, res, "Invalid token", 401, "Unauthorized")
        }   
        const user = await User.findById(decoded._id)
        req.user = user
        next()
    } catch (error) {
       response(req, res, error, 500, error.message)
    }
}
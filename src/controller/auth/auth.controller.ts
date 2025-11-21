import { error } from 'console';
import { response } from '../../helper/commenrespons';
const bcrypt = require('bcrypt')
import { errorMessage } from '../../helper/errorMessage';
import User, { UserDocument } from '../../model/user.model';
const jwt = require('jsonwebtoken')
import admin from 'firebase-admin';
const fireadmin = require('../../../firebaseauth');
import argon2 from 'argon2'
import firebaseadmin from '../../../firebaseauth';
import { generateAcessToken, generateRefreshToken, SaveRefreshToken } from '../../utils/token';
import RefreshToken from '../../model/refreshtoken.model';
require('dotenv').config()

/***
 * Author:praveen Kumar
 * Date: 26-05-2025
 * Description: This funtion is used to handle the signup 
 */

export const signup = async (req, res, next) => {
    try {
        console.log("req.body", req.body);
        const data: UserDocument = req.body;
        // console.log("name,email,password",name,email,password);
        const passwordhash = await bcrypt.hash(data.password, 10);
        const user = new User(data);
        user.password = passwordhash;
        const insertUser = await user.save();
        response(req, res, "", 201, "User registered successfully");
    } catch (err) {
        response(req, res, err, 500, err.message);
    }
}
/***
 * Author:praveen Kumar
 * Date: 26-05-2025
 * Description: This funtion is used to handle the login 
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await User.findOne({ email: email })
        if (!data) {
            response(req, res, "login User", 422, errorMessage.invalid)
        }
        const compare = await bcrypt.compare(password, data.password)
        if (!compare) {
            response(req, res, "login User", 422, "Invalid Crendentials")
        }
        const accessToken = await generateAcessToken(data._id, data.email)
        // const refreshToken = generateRefreshToken()
        // await SaveRefreshToken(data._id, refreshToken, 7)
        // if (compare) {
        //     const gentoken = await jwt.sign({ _id: data._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
        //     const safedata = {
        //         _id: data._id,
        //         name: data.name,
        //         email: data.email,
        //         Avatar: data.Avatar,
        //         location: data.location,
        //         bio: data.bio
        //     }
        //     response(req, res, { token: gentoken, user: safedata }, 200, "User login Sucessfully")
        // }
        const safedata = {
            _id: data._id,
            name: data.name,
            email: data.email,
            Avatar: data.Avatar,
            location: data.location,
            bio: data.bio
        }
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        })
        response(req, res, { user: safedata }, 200, "User login Sucessfully")
    }
    catch (err) {
        response(req, res, err, 500, err.message)
    }
}
/***
 * Author:praveen Kumar
 * Date: 30-10-2025
 * Description: This funtion is used to handle the google sessioin login 
 */
export const loginwithgoogle = async (req, res, next) => {
    try {
        const { token } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;
        let user = await User.findOne({ email: email });
        if (!user) {
            user = new User({
                UserId: uid,
                email: email,
                name: name,
                Avatar: picture
            });
            await user.save();
        }
        const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
        response(req, res, { token: jwtToken, user: user }, 200, "User login Successfully via Google");
    }
    catch (err) {
        response(req, res, err, 500, err.message)
    }
}
/***
 * Author:praveen Kumar
 * Date: 30-10-2025
 * Description: This funtion is used to handle the refresh token
 */
// export const getRefreshToken = async (req, res, next) => {
//     try {
//         const refreshToken = req.cookies.refresh_token;
//         if (!refreshToken) {
//             response(req, res, "", 401, "No Refresh Token Provided")
//         }
//         const token = await RefreshToken.find({
//             revoked: false,
//             expiresAt: { $gt: new Date() }
//         })
//         let validToken = null;
//         let tokenRecord = null;
//         for (const record of token) {
//             const isValid = await argon2.verify(refreshToken, record.tokenHash)
//             if (isValid) {
//                 validToken = refreshToken;
//                 tokenRecord = record;
//                 break;
//             }
//         }
//         if (!validToken || !tokenRecord) {
//             response(req, res, "", 401, "Invalid Refresh Token!")
//         }
//         if (tokenRecord.replaceByToken) {
//             await RefreshToken.updateMany({ userid: tokenRecord.userid }, { $set: { revoked: true } })
//             response(req, res, "", 401, "token Reuse Detected")
//         }
//         const user = await User.findById(tokenRecord.userId);
//         if (!user) {
//             response(req, res, "", 401, "User Not Found!")
//         }
//         const newAccessToken = generateAcessToken(user._id, user.email);
//         const newRefreshToken = generateRefreshToken();
//         const newTokenHash = await SaveRefreshToken(user._id, newRefreshToken, 7)
//         await RefreshToken.findById(tokenRecord._id, {
//             $set: {
//                 replaceByToken: newTokenHash,
//                 revoked: true
//             }
//         })
//         res.cookie('access_token', newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 15 * 60 * 1000
//         });

//         res.cookie('refresh_token', newRefreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             path: '/api/auth/refresh'
//         });
//         res.json({ success: true });
//     }
//     catch (err) {
//         response(req, res, err, 401, err.message)
//     }
// }
/***
 * Author:praveen Kumar
 * Date: 30-10-2025
 * Description: This funtion is used to check token present/not
 *
 */
export const checkToken = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if(!token){
            return res.json({ ok: true });
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        if (!decoded) {
             return res.json({ ok: false });
        }
        return res.json({ ok: true });
    }
    catch (err) {
        response(req,res,err,500,err);
    }
}
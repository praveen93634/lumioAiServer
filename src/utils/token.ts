import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import crypto from 'crypto';
import argon2 from 'argon2';
import RefreshToken from '../model/refreshtoken.model';
dotenv.config();
export const generateAcessToken = async (userId, email) => {
    return await jwt.sign(
        { userId, email, type: 'access' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

export const SaveRefreshToken=async(userid,refreshToken,expiresInDays=7)=>{
    const tokenHash=await argon2.hash(refreshToken);
    const expiresAt=new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    await RefreshToken.create({userid,tokenHash,expiresAt})
    return tokenHash;
}
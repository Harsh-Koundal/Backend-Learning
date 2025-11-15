import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.EXPIRES || "15m"})
};

export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn:process.env.REFRESH_TOKEN_EXPRIES || "7d"});
};

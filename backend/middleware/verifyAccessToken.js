import jwt from 'jsonwebtoken';

export const verifyAccessToken = async(token)=>{
    try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        return decoded;
    }catch(err){
        return null;
    }
};
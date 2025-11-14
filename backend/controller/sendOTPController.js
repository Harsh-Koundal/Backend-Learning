import {otpTemplate} from '../emails/otpTemplate.js';
import { generateOTP } from '../utils/generateOTP.js';
import { sendEmail } from '../utils/sendEmail.js';
import OTP from '../model/OTP.js';
import User from '../model/User.js';
import crypto from 'crypto';

export const sendOTPController = async (req, res)=>{
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(404).json({message:"email not found"});

    const otp = generateOTP();

    await OTP.create({email,otp});

    await sendEmail(email,"Your OTP code",otpTemplate("User",otp));

    res.status(201).json({message:"OTP Sent"})

    
};

export const verifyOTPController = async (req,res,next)=>{
    try{
        const {otp} = req.body;

        const record = await OTP.findOne({otp}).sort({createdAt: -1});

        if(!record) return res.status(400).json({message:"OTP expired or invalid"});

        if(record.otp !== otp)
            return res.status(400).json({message:"Invalid OTP"});

        const resetToken = crypto.randomBytes(32).toString("hex");
        
        res.json({message:"OTP verified",resetToken});
    }catch(err){
        next(err);
    }
}

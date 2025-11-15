import User from "../model/User.js ";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeTemplate } from "../emails/welcomeTemplate.js";
import { generateAccessToken,generateRefreshToken } from "../config/jwt.js";


export const signUp = async (req ,res ,next)=>{
    try{
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
           return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,12);

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        });

        const userWithoutPassword = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
        res.status(201).json({message:"Sign up successfully", data:userWithoutPassword});
        sendEmail(email,"Welcome to out App!",welcomeTemplate(name));
    }catch(err){
        next(err);
    }
};

export const signIn = async (req, res,next)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
           return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});

        const payload = {id:user._id,email:user.email,role:user.role};

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        user.refreshToken = [];
        user.refreshToken.push({token:refreshToken});
            await user.save();

        const cookieOptions = {
            httpOnly : true,
            secure : process.env.COOKIE_SECURE === "true",
            sameSite: process.env.COOKIE_SAME_SITE || "strict",
            maxAge: 1000*60*60*24*7
        };
        res.cookie("refreshToken",refreshToken,cookieOptions);
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role:user.role
        }
        res.status(200).json({ message: "Login successful", accessToken,data: userData});
    }catch(err){
        next(err);
    }
};

export const refreshToken = async (req,res,next)=>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token) return res.status(404).json({message:"No refresh token"});

        let decode;
        try{
            decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }catch(err){
            return res.status(403).json({message:"Invalid refresh token"});
        }

        const user = await User.findById(decode.id);
        if(!user) return res.status(404).json({message:"User not found"});
        const found = user.refreshToken.find((rt)=>rt.token === token);
        if(!found) return res.status(403).json({message:"Refresh token revoked"})
        const newAccressToken = generateAccessToken({id:user._id,email:user.email,role:user.role});
    const newRefreshToken = generateRefreshToken({id:user._id,email:user.email,role:user.role});

    user.refreshToken = user.refreshToken.filter(rt =>rt.token !== token);
    user.refreshToken.push({token:newRefreshToken});
    await user.save();
    
    const cookieOptions = {
        httpOnly:true,
        secure:process.env.COOKIE_SECURE === "true",
        sameSite:process.env.COOKIE_SAME_SITE || "strict",
        maxAge:1000*60*60*24*7
    };
    res.cookie("refreshToken",newRefreshToken,cookieOptions);

    res.json({accessToken:newAccressToken});
    }catch(err){
        next(err);
    }
};

export const logout = async (req,res,next)=>{
    try{
        const token = req.cookies?.refreshToken;
        if(!token){
            res.clearCookie("refreshToken");
            return res.json({message:"Logged out"});
        }
        let decoded;
        try{
            decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        }catch(err){
            res.clearCookie("refreshToken");
            return res.json({message:"Logged out"});
        }

        const user = await User.findById(decoded.id);
        if(user){
            user.refreshToken = user.refreshToken.filter(rt => rt.token !== token);
            await user.save();
        }

        res.clearCookie("refreshToken",{httpOnly:true,secure:process.env.COOKIE_SECURE === "true",sameSite:process.env.COOKIE_SAME_SITE || "strict"});
        res.json({message:"Logged out"});
    }catch(err) {next(err)}
}

export const getProfile = async (req, res, next)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
           return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User profile fetched successfully",data:user});
    }catch(err){
        next(err);
    }
}

export const users = async (req,res,next)=>{
    try{
         const users = await User.find({}).select("-password");
         res.status(200).json({message:"Users fetched successfully",
            data:users
         });
    }catch(err){
        next(err);
    }
};

export const deleteUser = async (req,res,next)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.json({message:"user deleted"});
    }catch(err){
        next(err);
    }
};

export const updateUsers = async (req,res,next)=>{
    try{
        const {id} = req.params;
        const update = req.body;
        const updateUser = await User.findByIdAndUpdate(id,
            {$set:update},
            {new:true}
        );
        if(!updateUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User updated"});
        
    }catch(err){
        next(err);
    }
};

//Backend Search, Filter & Pagination
export const adminControles = async(req,res,next)=>{
    try{
        const {search = "", role="", page=1, limit=5} = req.query;
        const query = {
            $or:[
                {name: {$regex:search, $options:'i'}},
                {email:{$regex:search, $options:'i'}},
            ],
        };
        if(role) query.role = role;

        const skip = (page - 1)*limit;

        const users = await User.find(query)
        .select('-password')
        .skip(skip)
        .limit(Number(limit));

        const total = await User.countDocuments(query);

        res.json({
            data:users,
            total,
            totalPages: Math.ceil(total/limit),
            currentPage: Number(page),
        });
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}


export const resetPassword = async (req,res,next) =>{
    try{
        const {email ,newPassword} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"User not found"});

        const hashed = await bcrypt.hash(newPassword,12);
        user.password = hashed;

        await user.save();
        res.json({message:"Password reset successful"});
    }catch(err){
        next(err);
    }
};
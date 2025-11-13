import User from "../model/User.js ";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

        const token = jwt.sign(
            {id:user._id, email:user.email,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role:user.role
        }
        res.status(200).json({ message: "Login successful", token,data: userData});
    }catch(err){
        next(err);
    }
};

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


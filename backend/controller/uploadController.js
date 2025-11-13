import cloudinary from '../config/cloudinary.js';
import File from '../model/File.js';

export const uploadFile = async(req,res,next)=>{
    try{
    const f = req.file;
    if(!f) return res.status(400).json({message:"No file uploaded"});

    const saved = await File.create({
        filename:f.originalname,
        url:f.path || f.secure_url,
        public_id:f.filename || f.public_id,
        mimeType:f.mimeType,
        size:f.size,
    });

    res.status(201).json({message:"File uploaded",data:saved});
    
}catch(err){
    next(err);
}

};


export const getFiles = async(req,res,next)=>{
    try{
        const files = await File.find().sort({createdAt:-1}).limit(100);
        res.status(201).json({message:"File fetched",data:files})
    }catch(err){
        next(err);
    }
};

export const deleteFile = async(req,res,next)=>{
    try{
        const file = await File.findById(req.params.id);
        if(!file) return res.status(404).json({message:"File not found"});

        await cloudinary.uploader.destroy(file.public_id); //deleteing from cloudinary
        
        await File.findByIdAndDelete(req.params.id);

        res.status(201).json({message:"File deleted"});
    }catch(err){
        next(err);
    }
};


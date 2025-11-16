import multer from 'multer';
import CloudinaryStorage  from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Files",
        allowed_formats:["jpg", "jpeg", "png", "webp", "gif", "pdf", "docx"],
        transformation:[{width:1600,crop:"limit"}],
    },
});

const upload = multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter:(req,file,cb)=>{
        const allowed =  /jpeg|jpg|png|gif|webp|pdf|docx/;
        if(allowed.test(file.mimetype)) cb(null, true);
        else cb(new Error("Unsupported file type"),false);
    },
});

export default upload;

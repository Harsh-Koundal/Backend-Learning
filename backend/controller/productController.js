import Product from "../model/Product.js";
import cloudinary from '../config/cloudinary.js'


export const productUpload = async (req,res,next)=>{
    try{
        const {name,price,description,category,stock} = req.body;
        const file = req.file;

        const product = await Product.create({
            name,
            price,
            description,
            category,
            stock,
            image:file.path,
            imagePublicId:file.filename,
            createdBy:req.user.id,
        });

        res.status(201).json({message:"Product created", data:product});
    }catch(err){
        next(err);
    }
};


export const getProduct = async(req,res,next)=>{
    try{
        const {search = "",category="",page=1,limit=8} = req.query;
        const query = {
            name:{$regex:search, $options:"i"},
        };

        if(category) query.category = category;

        const skip = (page -1)*limit;

        const products = await Product.find(query)
        .skip(skip)
        .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(201).json({message:"Product fetched",
            data:products,
            total,
            totalPages:Math.ceil(total/limit),
            currentPage:Number(page),
        });
    }catch(err){
        next(err);
    }
};

export const upadteProduct = async(req,res,next)=>{
    try{
        const product = await Product.findById(req.params.id);

        if(!product) return res.status(404).json({message:"Not found"});

        if(req.file){
            await cloudinary.uploader.destroy(product.imagePublicId);
            product.image = req.file.path;
            product.imagePublicId = req.file.filename;
        }

        Object.assign(product, req.body);
        await product.save();

        res.json({message:"Product updated",data:product});
    }catch(err){
        next(err);
    }
}

export  const deleteProduct = async(req,res,next)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message:"Product not found"});

        await cloudinary.uploader.destroy(product.imagePublicId);
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Product deleted"});
    }catch(err){
        next(err);
    }
};


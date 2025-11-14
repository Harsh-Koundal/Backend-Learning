import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    category:{type:String},
    stock:{type:Number,default:1},
    image:{type:String},
    imagePublicId:{type:String},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref :"User"},

},
    {timestamps:true}
);

const Product = mongoose.model("Product",productSchema);

export default Product;

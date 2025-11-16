import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:false},
    razorpay_order_id:{type:String, required:true,unique:true},
    razorpay_payment_id:{type:String},
    razorpay_signature:{type:String},
    amount:{type:Number,required:true},
    currency:{type:String,default:"INR"},
    status:{type:String,enum:["created","paid","failed"], default:"created"},
    receipt:{type:String},
    createdAt:{type:Date,default:Date.now}
},
{timestamps:true}
);

export default mongoose.model("Order",orderSchema);

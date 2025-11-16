import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../model/Order.js';
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

export const createPayment = async(req, res, next)=>{
    try{
        const {amount, currency = 'INR', receipt} = req.body;
        if(!amount) return res.status(400).json({message:"Amount required"});

        const options = {
            amount: Number(amount),
            currency,
            receipt:receipt || `ecpt_${Date.now()}`,
            payment_capture:1,
        };
        const order = await Razorpay.orders.create(options);

        const saved = await Order.create({
            user:req.user?.id,
            razorpay_order_id:order.id,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            status:"created",
        });
        res.status(200).json({message:"Order created",order,saved})
    }catch(err){
        next(err);
    }
};


export const verifyPayment = async(req,res,next)=>{
    try{
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;
        if(!razorpay_order_id || razorpay_payment_id || razorpay_signature){
            return res.status(400).json({message:"Missing fields"});
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

        if(expectedSignature === razorpay_signature){
            const order = await Order.findByIdAndUpdate(
                {razorpay_order_id},
                {razorpay_payment_id, razorpay_signature, status:"paid"},
                {new:true},
            );
            return res.json({message:"Payment verified",order});
        }else{
            await Order.findByIdAndUpdate({razorpay_order_id},{status:"failed"});
        }
    }catch(err){
        next(err);
    }
};
import mongoose, { mongo } from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},
    actor :{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    type:{type:String,required:true},
    title:{type:String,required:true},
    body:{type:String,required:true},
    data:{type:Object},
    read:{type:Boolean,default:false},
    archived:{type:Boolean,default:false},
},
{timestamps:true});

export default mongoose.model("Notification",notificationSchema);
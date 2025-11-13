import mongoose from 'mongoose';

const FileSchema = new mongoose.Schema({
    filename:{type:String, required:true},
    url:{type:String, required:true},
    public_id:{type:String, required:true},
    mimeType:{type:String},
    size:{type:Number},
    uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:false},
    createdAt:{type:Date, default:Date.now},

});

const File = mongoose.model("File",FileSchema);
export default File;
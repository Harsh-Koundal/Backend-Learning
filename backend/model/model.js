import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String,required:true, unique:true},
    password:{type:String , required:true},
    
    date :{type:Date, default:Date.now}
},
{timestamps:true}
);
const Users = mongoose.model("Users", usersSchema);
export default Users;

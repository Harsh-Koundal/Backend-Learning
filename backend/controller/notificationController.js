import { data } from "react-router-dom";
import Notification from "../model/Notification.js";

export const createNotification = async({userId,actorId=null,type,title,body,data={}},io,onlineUsers)=>{
    const n = await Notification.create({
        user:userId,
        actor:actorId,
        type,
        title,
        body,
        data
    });

    const sockets = onlineUsers.get(String(userId));
    if(sockets && sockets.size>0){
        sockets.forEach(socketId=>{
            io.to(socketId).emit("notification:new",{
                _id:n._id,
                type:n.type,
                title:n.title,
                body:n.body,
                data:n.data,
                createdAt:n.createdAt,
                isRead:n.isRead,
            });
        });
    }

    const uread = await Notification.countDocuments({user:userId,isRead:false});
    if(sockets && sockets.size>0){
        sockets.forEach(socketId=>{

            io.to(socketId).emit("notification:unreadCount",unread);
        });
    }
    return n;
};

export const getNotifications = async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 20);
        const skip = (page-1)*limit;

        const notifications = await Notification.find({user:userId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

        const total = await Notification.countDocuments({user:userId});

        res.josn({data:notifications,total,page,totalPages:Math.ceil(total/limit)});
    }catch(err){
        next(err);
    }
};

export const markAsRead = async (req,res,next)=>{
    try{
        const userId = req.user.id;
        const {id} = req.params;
        const n = await Notification.findByIdAndUpdate(
            {_id:id,user:userId},
            {isRead:true,readAt:new Date()},
            {new:true}
        );
        if(!n) return res.status(404).josn({message:"Not found"});

        const unread = await Notification.countDocuments({user:userId,isRead:false});

        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");

        const sockets = onlineUsers.get(String(userId));
        if(sockets){
            sockets.forEach(socketId=>io.to(socketId).emit("notification:unreadCount",unread));
        }
        res.josn({message:"Marked read",data:n,unread});

    }catch(err){
        next(err);
    }
};

export const  markAllRead = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        await Notification.updateMany({user:userId,isRead:false},{isRead:true,readAt:new Date()});

        const io = req.app.get("io");
        const onlineUsers = req.app.get("onlineUsers");
        const sockets = onlineUsers.get(String(userId));
        if(sockets){
            sockets.forEach(socketId => io.to(socketId).emit("notification:unreadCount",0));
            sockets.forEach(socketId=>io.to(socketId).emit("notification:allRead"));
        }
        res.josn({message:"All marked read"});
    }catch(err){
        next(err); 
    }
}
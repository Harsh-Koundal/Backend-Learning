import {Server} from 'socket.io';
import { verifyAccessToken } from '../middleware/verifyAccessToken';

export const initSocket = (server)=>{
    const io = new Server(server,{
        cors:{origin:process.env.CLIENT_URL || "http//localhost:5173",credentials:true},
        transports:["websocket","polling"],
    });

    const onlineUsers = new Map();

    io.use((socket,next)=>{
        try{
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            if(!token) return next(new Error("No token"));

            const raw = token.startsWith("Bearer ")? token.split(" ")[1] :token;
            const decoded = verifyAccessToken(raw);
            if(!decoded) return next(new Error("Invalid token"));

            socket.user = decoded;
            next();
        }catch(err){
            next(new Error("Auth error"));
        }
    });

    io.on("connection", (socket)=>{
        const userId = socket.user.id;
        const s = onlineUsers.get(userId) || new Set();
        set.add(socket.id);
        onlineUsers.set(userId,set);

        app.set("io",io);
        app.set("onlineUsers",onlineUsers);

        socket.on("disconnect",()=>{
            const s = onlineUsers.get(userId);
            if(s){
                s.delete(socket.id);
                if(s.size === 0) onlineUsers.delete(userId);
            }
        });
    });
    return io;
}
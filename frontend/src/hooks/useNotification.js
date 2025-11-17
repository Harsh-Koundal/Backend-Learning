import { useEffect, useState } from "react";
import api from "../utils/api";
import { connectSocket, getSocket } from "../utils/socket";

export default function useNotifications(token) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(()=>{
    if(!token) return;
    const socket = connectSocket(token);

    socket.on("notification:new", (n) => {
      setNotifications(prev => [n, ...prev]);
      setUnreadCount(c => c + 1);
    });

    socket.on("notification:unreadCount", (c) => setUnreadCount(c));
    socket.on("notification:allRead", ()=> setUnreadCount(0));

    // fetch initial list and unread count
    (async ()=>{
      try{
        const res = await api.get("/api/notifications?limit=10");
        setNotifications(res.data.data);
        const total = await api.get("/api/notifications?limit=1&page=1"); // alternate: backend provide unread count endpoint
        // you may want an endpoint /api/notifications/unreadCount
      }catch(e){}
    })();

    return ()=>{ socket.off("notification:new"); socket.off("notification:unreadCount"); }
  },[token]);

  return { notifications, setNotifications, unreadCount, setUnreadCount };
}

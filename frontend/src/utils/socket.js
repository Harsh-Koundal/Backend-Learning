import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:3000", {
    transports: ["websocket", "polling"],
    auth: { token: `Bearer ${token}` },
  });

  socket.on("connect", () => console.log("Socket connected", socket.id));
  socket.on("connect_error", err => console.error("Socket error", err.message));

  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

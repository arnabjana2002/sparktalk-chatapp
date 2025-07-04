import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

//* It is used to store Online Users
const userSocketMap = {}; //* {userId: socketId}

io.on("connection", (socket) => {
  // console.log("A user has connected", socket.id);

  // Getting the onlineUsers users
  const userId = socket.handshake.query.userId; // Receiving authUser id from the socket
  if (userId) userSocketMap[userId] = socket.id;

  // Broadcasting the online users list to every other users
  // io.emit() -> is used to send events to all the connected clinets
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("A user has disconnected", socket.id);
    // If a user disconnects broadcast that too
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

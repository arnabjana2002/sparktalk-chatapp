import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "../routes/auth.route.js";
import messageRoutes from "../routes/message.route.js";
import { connectDB } from "../lib/db.js";
import { app, server } from "../lib/socket.js";

import path from "path";

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// const app = express();
//* App is imported from Socket.js File

// Common Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//! Api Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Configuration for production
if (process.env.NODE_ENV === "production") {
  // Serve static files from the dist folder in React app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // match any route, send back React's static index.html file in dist folder
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(port, () => {
  console.log("Server is listening to port:", port);
  connectDB();
});

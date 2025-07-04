import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage
} from "../controllers/message.controller.js";

const router = Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:userId", protectRoute, getMessages);

router.post("/send/:userId", protectRoute, sendMessage);

export default router;

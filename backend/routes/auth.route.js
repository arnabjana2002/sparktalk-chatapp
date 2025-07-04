import express, { Router } from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Updating the Profile Picture
router.put("/update-profile", protectRoute, updateProfile);

// Check
router.get("/check", protectRoute, checkAuth);

export default router;

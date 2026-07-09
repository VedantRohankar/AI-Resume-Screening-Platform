import { createUserProfile, getProfile,updateUserProfile } from "../controllers/profileController.js";
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateProfile } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", verifyToken,validateProfile, createUserProfile);

router.get("/", verifyToken,getProfile);

router.put("/", verifyToken,validateProfile,  updateUserProfile);

export default router;
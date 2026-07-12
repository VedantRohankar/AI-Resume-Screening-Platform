import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isCandidate } from "../middleware/roleMiddleware.js";
import { getProfile } from "../controllers/userController.js";



const router = express.Router();

router.get("/profile",verifyToken,isCandidate,getProfile);

export default router;

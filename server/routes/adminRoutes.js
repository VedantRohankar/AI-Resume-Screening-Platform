import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getUsers, getDashboard } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, getDashboard);

router.get("/users", verifyToken, isAdmin, getUsers);


export default router;
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getUsers, getDashboard, removeUser, getJobs, removeJob, getCompanies, removeCompany } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard", verifyToken, isAdmin, getDashboard);

router.get("/users", verifyToken, isAdmin, getUsers);

router.delete("/users/:id",verifyToken,isAdmin,removeUser);

router.get("/jobs",verifyToken,isAdmin,getJobs);

router.delete("/jobs/:id",verifyToken,isAdmin,removeJob);

router.get("/companies",verifyToken,isAdmin,getCompanies);

router.delete("/companies/:id",verifyToken,isAdmin,removeCompany);

export default router;
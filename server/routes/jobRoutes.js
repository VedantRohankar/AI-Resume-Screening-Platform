import express from "express";

import {
  createRecruiterJob,
  getRecruiterJobs,
  getJobs,
  getSingleJob,
  editJob,
  removeJob,
} from "../controllers/jobController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isRecruiter } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Recruiter Routes
router.post("/", verifyToken, isRecruiter, createRecruiterJob);

router.get("/my-jobs", verifyToken, isRecruiter, getRecruiterJobs);

router.patch("/:id", verifyToken, isRecruiter, editJob);

router.delete("/:id", verifyToken, isRecruiter, removeJob);

// Candidate/Public Routes
router.get("/", getJobs);

router.get("/:id", getSingleJob);

export default router;
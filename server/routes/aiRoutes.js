import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {analyzeResumeAI, getResumeAIAnalysis} from '../controllers/aiController.js';
import { analyzeAIJobMatch } from "../controllers/aiJobMatchController.js";

const router = express.Router();

router.post("/resume-analysis/analyze",verifyToken,analyzeResumeAI);
router.get("/resume-analysis",verifyToken,getResumeAIAnalysis);
router.post("/job-match/:applicationId",verifyToken,analyzeAIJobMatch);

export default router;
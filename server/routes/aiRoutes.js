import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {analyzeResumeAI, getResumeAIAnalysis} from '../controllers/aiController.js';

const router = express.Router();

router.post("/resume-analysis/analyze",verifyToken,analyzeResumeAI);
router.get("/resume-analysis",verifyToken,getResumeAIAnalysis);

export default router;
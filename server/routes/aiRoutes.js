import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {testResumeAI, getResumeAIAnalysis} from '../controllers/aiController.js';

const router = express.Router();

router.get("/test-resume-ai",verifyToken,testResumeAI);
router.get("/resume-analysis",verifyToken,getResumeAIAnalysis);

export default router;
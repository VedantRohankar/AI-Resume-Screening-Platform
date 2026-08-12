import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {testResumeAI} from '../controllers/aiController.js';

const router = express.Router();

router.get("/test-resume-ai",verifyToken,testResumeAI);

export default router;
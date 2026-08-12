import express from 'express';
import {verifyToken} from '../middleware/authMiddleware.js';
import {testResumeExtraction} from '../controllers/aiController.js';

const router = express.Router();

router.get("/test-resume-extraction",verifyToken,testResumeExtraction);

export default router;
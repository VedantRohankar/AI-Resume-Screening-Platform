import express from 'express';
import {testGemini} from '../controllers/aiController.js';

const router = express.Router();

router.get("/test",testGemini);

export default router;
import express from "express";

import upload from "../middleware/uploadMiddleware.js";

import {verifyToken} from "../middleware/authMiddleware.js";

import {uploadResume} from '../controllers/resumeController.js';

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("resume"),
  uploadResume
);

export default router;
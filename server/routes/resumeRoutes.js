import express from "express";

import upload from "../middleware/uploadResume.js";

import {verifyToken} from "../middleware/authMiddleware.js";

import {uploadResume, getResume, removeResume, downloadResume} from '../controllers/resumeController.js';

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.single("resume"),
  uploadResume
);

router.get("/",verifyToken,getResume);
router.delete("/",verifyToken,removeResume);
router.get("/download",verifyToken,downloadResume);

export default router;
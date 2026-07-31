import express from 'express';

import{
   applyForJob,
  getMyApplications,
  getJobApplicants,
  changeApplicationStatus,
}
from '../controllers/applicationController.js';

import {verifyToken} from '../middleware/authMiddleware.js';
import {isCandidate,isRecruiter} from '../middleware/roleMiddleware.js';


const router = express.Router();

// Candidate Routes
router.post('/:jobId',verifyToken,isCandidate,applyForJob);

router.get("/my-applications",verifyToken,isCandidate,getMyApplications);

//Recruiter Routes
router.get("/job/:jobId",verifyToken,isRecruiter,getJobApplicants);

router.patch("/:id/status",verifyToken,isRecruiter,changeApplicationStatus);

export default router;

import {
  createApplication,
  getApplicantsByJob,
  getCandidateApplication,
  updateApplicationStatus
  } from '../models/applicationModel.js';

import {getJobById} from '../models/jobModel.js';

//Candidate applies for a job
export const applyForJob = async (req,res) => {
  try {
    const candidateId = req.user.id;
    const jobId = req.params.jobId;

    //check if job exist
    const job = await getJobById(jobId);
    if (!job) {
      return res.status(404).json({
        message:"Job not Found",
      });
    }

    const application = await createApplication(
      jobId,
      candidateId
    );

    res.status(201).json({
      message:"Application Submitted Successfully",
      application,
    });

  } catch (error) {
    console.log(error);
    //Duplicate application
    if (error.code === "23505") {
      return res.status(400).json({
        message:"You have already applied for this job",
      });
    }
    res.status(500).json({
      message:"Server Error",
    });
    
  }
};

//Candidate views their applications

export const getMyApplications = async (req,res) => {
  try {
    const candidateId = req.user.id;

    const applications = await getCandidateApplication(candidateId);

    res.status(200).json(applications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//Recruiter view applicants for a job

export const getJobApplicants = async (req,res) => {
  try {
    const jobId = req.params.jobId;
    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        message:"Job not Found",
      });
    }
    const applicants = await getApplicantsByJob(jobId);
    res.status(200).json(applicants);
  } catch (error) {
     console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

//Recruiter Updates Application Status

export const changeApplicationStatus = async (req,res) => {
  console.log("PATCH /status controller reached");
  try {
    const applicationId = req.params.id;

    const {status} = req.body;
     
    const application = await updateApplicationStatus(
      applicationId,
      status
    );

    if (!application) {
        return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });




  } catch (error) {
     console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
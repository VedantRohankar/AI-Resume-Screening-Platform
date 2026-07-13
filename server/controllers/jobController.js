import {
  createJob,
  getJobsByCompanyId,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../models/jobModel.js";

import { getCompanyByRecruiterId } from "../models/companyModel.js";

export const createRecruiterJob = async (req,res) => {
  try {
     const recruiterId = req.user.id;

    const company = await getCompanyByRecruiterId(recruiterId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level,
    } = req.body;

    const job = await createJob(
      company.id,
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level
    );

    res.status(201).json({
      message: "Job created successfully",
      job,
    });

    
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
    
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {

    const recruiterId = req.user.id;

    const company = await getCompanyByRecruiterId(recruiterId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const jobs = await getJobsByCompanyId(company.id);

    res.status(200).json(jobs);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getJobs = async (req, res) => {
  try {

    const jobs = await getAllJobs();

    res.status(200).json(jobs);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getSingleJob = async (req, res) => {
  try {

    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const editJob = async (req, res) => {
  try {

    const recruiterId = req.user.id;

    const company = await getCompanyByRecruiterId(recruiterId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level,
      status,
    } = req.body;

    const job = await updateJob(
      req.params.id,
      company.id,
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level,
      status
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const removeJob = async (req, res) => {
  try {

    const recruiterId = req.user.id;

    const company = await getCompanyByRecruiterId(recruiterId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const job = await getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await deleteJob(req.params.id, company.id);

    res.status(200).json({
      message: "Job deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
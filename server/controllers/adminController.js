import { getAllUsers, deleteUserId } from "../models/userModel.js";
import {getDashboardStats} from '../models/adminModel.js';
import { getAllJobsAdmin, deleteJobById } from "../models/jobModel.js";
import {getAllCompaniesAdmin, deleteCompanyById} from '../models/companyModel.js';

export const getUsers = async(req,res)=>{
  try {
    
    const users= await getAllUsers();

    if(!users){
      return res.status(404).json({
        message:"Users Not Found",
      });
    }

    res.json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
    
  }

};

export const getDashboard = async (req,res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const removeUser = async (req,res) => {
  try {
    const userId = req.user.id;
    const user = await deleteUserId(userId);

    if (!user) {
       return res.status(404).json({
        message: "User not found",
      });
    }

      res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
      console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getJobs = async (req, res) => {
  try {

    const jobs = await getAllJobsAdmin();

    res.status(200).json(jobs);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const removeJob = async (req,res) => {
  try {
    const jobId = req.params.id;
    const job = await deleteJobById(jobId);

    if (!job) {
       return res.status(404).json({
        message: "Job not found",
      });
    }

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

export const getCompanies = async (req,res) => {
  try {
    const company = await getAllCompaniesAdmin();
    res.status(200).json(company);

  } catch (error) {
    console.log(error);
     res.status(500).json({
      message: "Server Error",
    });
  }
};

export const removeCompany = async (req,res) => {
  try {
    const companyId = req.params.id;
    const company = await deleteCompanyById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    res.status(200).json({
      message: "Company deleted successfully",
    });

  } catch (error) {
     console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
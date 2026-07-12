import {createCompany, getCompanyByRecruiterId, updateCompany, deleteCompany} from "../models/companyModel.js";

export const createRecruiterCompany = async (req, res) => {
  try {

    const recruiterId = req.user.id;

    const {
      company_name,
      industry,
      website,
      description,
      location,
      company_logo,
    } = req.body;

    const existingCompany = await getCompanyByRecruiterId(recruiterId);

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists",
      });
    }

    const company = await createCompany(
      recruiterId,
      company_name,
      industry,
      website,
      description,
      location,
      company_logo
    );

    res.status(201).json({
      message: "Company created successfully",
      company,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCompany = async (req,res) => {
  try {
    const recruiterId = req.user.id;
    const company = await getCompanyByRecruiterId(recruiterId);

    if (!company) {
       return res.status(404).json({
        message:"Company not Found",
      });
    }
    res.status(200).json(company);

    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};

export const editCompany = async (req,res) => {
  try {
    const recruiterId = req.user.id;
     const {
      company_name,
      industry,
      website,
      description,
      location,
      company_logo,
    } = req.body;

   const company = await updateCompany(
      recruiterId,
    company_name,
    industry,
    website,
    description,
    location,
    company_logo
    );

   if (!company) {
      return res.status(404).json({
        message:"Company not Found",
      });
    }

   res.status(200).json({
      message: "Company updated successfully",
      company,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};

export const removeCompany = async (req,res) => {
  try {
     const recruiterId = req.user.id;
      const company = await getCompanyByRecruiterId(recruiterId);

     if (!company) {
       return res.status(404).json({
        message:"Company not Found",
      });
    }

    await deleteCompany(recruiterId);

     res.status(200).json({
      message: "Company deleted successfully",
    });

  } catch (error) {
     console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};
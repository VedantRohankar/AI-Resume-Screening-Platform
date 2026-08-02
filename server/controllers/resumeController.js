// import fs from "fs";
// import path from "path";
import cloudinary from "../config/cloudinary.js";

import{
  createResume,
  getResumeByCandidateId,
  deleteResume,
} from "../models/resumeModel.js";

export const uploadResume = async (req,res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({
        message:"Please upload a PDF file",
      });
    }

    const candidateId = req.user.id;

    const existingResume = await getResumeByCandidateId(candidateId);

    //! Delete old resume if it exist-Local Storage File system approach
    // if (existingResume) {
    //   const oldFile = path.join(existingResume.resume_url);
    //   if (fs.existsSync(oldFile)) {
    //     fs.unlinkSync(oldFile);
    //   }
      
    //     await deleteResume(candidateId);
    //   }



    //! Delete old resume if it exist--Cloudinary Approach
    if (existingResume) {
      await cloudinary.uploader.destroy(
        existingResume.file_name,
        {
          resource_type: "raw",
        }
      );
      await deleteResume(candidateId);
    }
      const resume = await createResume(
        candidateId,
        req.file.path,
        req.file.filename,
        req.file.size
      );

      res.status(201).json({
        message:"Resume uploaded Successfully",
        resume,
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
    
  }
};

export const getResume = async (req,res) => {
  try {
    const candidateId = req.user.id;

    const resume = await getResumeByCandidateId(candidateId);

    if (!resume) {
      return res.status(404).json({
        message:"Resume not Found",
      })
    }

    res.status(200).json(resume);



  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};

export const removeResume = async (req,res) => {
  try {
    const candidateId = req.user.id;
    const resume = await getResumeByCandidateId(candidateId);

    if (!resume) {
      return res.status(404).json({
        message:"Resume not Found",
      })
    }
    //! Local Storage File system approach
    // const filePath = path.join(resume.resume_url);

    // if (fs.existsSync(filePath)) {
    //   fs.unlinkSync(filePath);
    // }

    //! Cloudinary Approach
    await cloudinary.uploader.destroy(
      resume.file_name,
      {
        resource_type: "raw",
      }
    );
    
    await deleteResume(candidateId);

     res.status(200).json({
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};

export const downloadResume = async (req,res) => {
  try {

    const candidateId = req.user.id;
    const resume = await getResumeByCandidateId(candidateId);

     if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    //! Local Storage File system approach
    // const filePath = path.resolve(resume.resume_url);

    // res.download(filePath,resume.file_name);

     //! Cloudinary Approach
     return res.redirect(resume.resume_url);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
}
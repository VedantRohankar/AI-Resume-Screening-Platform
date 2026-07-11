import fs from "fs";
import path from "path";

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

    //Delete old resume if it exist
    if (existingResume) {
      const oldFile = path.join(existingResume.resume_url);
      if (fs.existsSync(oldFile)) {
        fs.unlinkSync(oldFile);
      }
      
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

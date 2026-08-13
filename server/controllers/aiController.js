
//!Add a temporary test controller
import { getResumeByCandidateId } from "../models/resumeModel.js";
import {downloadResume} from '../services/downloadServices.js'
import { extractTextFromPDF } from "../services/pdfServices.js";
import { analyzeResume } from "../services/geminiServices.js";

import  {validateResumeAnalysis} from '../services/aiValidatationServices.js';

import {createResumeAnalysis, getResumeAnalysisByResumeId} from '../models/resumeAnalysisModel.js';

  export const testResumeAI = async (req, res) => {
  try {
    const candidateId = req.user.id;

    console.log("Candidate ID:", candidateId);
    //! Get Resume Info from PostgreSql
    const resume = await getResumeByCandidateId(candidateId);

    console.log("Resume from DB:", resume);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }
    //! Download PDF from cloudinary
    const pdfBuffer = await downloadResume(resume.resume_url);

    console.log("PDF downloaded successfully");
    //! Extract Text From Resume.
    const resumeText = await extractTextFromPDF(pdfBuffer);

    console.log("PDF text extracted successfully");

    const analysis = await analyzeResume(resumeText);

    const savedAnalysis = await createResumeAnalysis(
      resume.id,
      analysis.ats_score,
      analysis.summary,
      analysis.skills.join(","),
      analysis.missing_skills.join(","),
      [...analysis.strengths,
        ...analysis.weaknesses,
      ].join("/n")
    );
    return res.status(200).json({
      message: "Resume Analysis Successful",
      analysis,
      savedAnalysis,
    });

    validateResumeAnalysis(analysis);
    return res.status(200).json({
      message: "Resume has been Validated",
      analysis,
    })

    console.log("Gemini analysis completed");

    return res.status(200).json({
      message: "Resume analyzed successfully",
      analysis,
    });

  } catch (error) {
    console.error("AI ANALYSIS ERROR:", error);

    return res.status(500).json({
      message: "AI-Resume Analysis Failed",
      error: error.message,
    });
  }
};

export const getResumeAIAnalysis = async (req,res) => {
  try {
    const candidateId = req.user.id;
    const resume = await getResumeByCandidateId(candidateId);
    if (!resume) {
      return res.status(404).json({
        message: "Resume Not Found",
      });
    }

    const analysis = await getResumeAnalysisByResumeId(resume.id);

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis Not Found",
      });
    }

    return res.status(200).json({
      message: "AI-Analysed Resumed Fetched Successfully",
      analysis,
    })

  } catch (error) {
    console.log("GET AI ANALYSIS ERROR",error);
    return res.status(500).json({
      message: "AI-Resume Fetching Failed",
    });
  }
}

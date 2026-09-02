import {createAIJobMatch, getAIJobByApplication, updateAIJobMatch} from '../models/aiJobMatchModel.js';
import catchAsync from "../utils/catchAsync.js";
import {analyzeCandidateJobMatch  } from "../services/aiJobMatchServices.js";
import { getApplicationForAIMatching } from '../models/applicationModel.js';
import { getAIResumeAnalysisByCandidateId } from "../models/resumeAnalysisModel.js";

export const analyzeAIJobMatch = catchAsync(async (req,res) => {
  const {applicationId} = req.params;

  const application = await getApplicationForAIMatching(applicationId);

  if (!application) {
     return res.status(404).json({
      success: false,
      message: "Application not found",
    });
  }
  const candidateAnalysis = await getAIResumeAnalysisByCandidateId(application.candidate_id);

  if (!candidateAnalysis) {
  return res.status(404).json({
    success: false,
    message: "AI resume analysis not found for this candidate",
  });
}

// Safely parse the JSON data in case we need to extract education/experience
const parsedAnalysisData = typeof candidateAnalysis.analysis_data === 'string' 
  ? JSON.parse(candidateAnalysis.analysis_data) 
  : (candidateAnalysis.analysis_data || {});

const candidateProfile = {
  skills: candidateAnalysis.skills,
  summary: candidateAnalysis.summary,
  education: parsedAnalysisData.education || "Education details found in resume",
  experience: parsedAnalysisData.experience || "Experience details found in resume",
};

const job = {
  title: application.title,
  description: application.description,
  requirements: application.requirements,
  experience_level: application.experience_level,
}

const analysis = await analyzeCandidateJobMatch(
  candidateProfile,
  job
  );

  const existingMatch = await getAIJobByApplication(applicationId);
  let savedMatch;

  if (existingMatch) {
    savedMatch = await updateAIJobMatch(
      applicationId,
      analysis.match_score,
      analysis.matched_skills,
      analysis.missing_skills,
      analysis.experience_match,
      analysis.recommendation,
      analysis.summary,
      analysis
    );
  } else {
    savedMatch = await createAIJobMatch(
      applicationId,
      analysis.match_score,
      analysis.matched_skills,
      analysis.missing_skills,
      analysis.experience_match,
      analysis.recommendation,
      analysis.summary,
      analysis
    );
  }

  return res.status(200).json({
    success: true,
    message: "AI job match generated successfully",
    match: savedMatch,
  });
});

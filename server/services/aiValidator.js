
export const validateResumeAnalysis = (analysis) => {
  if (!analysis || !typeof analysis  == 'object') {
    throw new Error("Invalid AI Response");
  }

  if (!typeof analysis.candidate_name  == 'string') {
    throw new Error("Invalid candidate_name");
  }

  if (!Array.isArray(analysis.skills)) {
    throw new Error("Invalid analysied skills");
  }

  if (!Array.isArray(analysis.education)) {
    throw new Error("Invalid analysied education");
  }

  if (!Array.isArray(analysis.experience)) {
    throw new Error("Invalid analysied experience");
  }

  if (!Array.isArray(analysis.projects)) {
    throw new Error("Invalid analysied project");
  }

  if (!Array.isArray(analysis.certifications)) {
    throw new Error("Invalid analysied certifications");
  }

  if (
    !typeof analysis.ats_score == 'number' || analysis.ats_score < 0 || analysis.ats_score > 100
     ) {
    throw new Error("Invalid ats_score");
  }

  if (!Array.isArray(analysis.strengths)) {
    throw new Error("Invalid analysied strengths");
  }

  if (!Array.isArray(analysis.weaknesses)) {
    throw new Error("Invalid analysied weaknesses");
  }
  
  if (!Array.isArray(analysis.missing_skills)) {
    throw new Error("Invalid analysied missing_skills");
  }

  if (!typeof analysis.summary == 'string') {
    throw new Error("Invalid Summary");
  }

  if (!Array.isArray(analysis.interview_questions)) {
    throw new Error("Invalid Interview_questions");
  }

  return true;
};
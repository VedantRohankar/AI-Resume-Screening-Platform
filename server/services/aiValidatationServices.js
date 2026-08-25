
const requiredFields = [
  "candidate_name",
  "email",
  "phone",
  "skills",
  "education",
  "experience",
  "projects",
  "certifications",
  "ats_score",
  "strengths",
  "weaknesses",
  "missing_skills",
  "summary",
  "interview_questions",
];

export const validateResumeAnalysis = (analysis) => {

  // 1. Check that Gemini returned an object
  if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
    throw new Error("AI response is not a valid object");
  }

  // 2. Check required fields
  for (const field of requiredFields) {
    if (!(field in analysis)) {
      throw new Error(`AI response missing field: ${field}`);
    }
  }

  // 3. Validate candidate name
  if (typeof analysis.candidate_name !== "string") {
    throw new Error("Invalid candidate_name");
  }

  // 4. Validate email
  if (typeof analysis.email !== "string") {
    throw new Error("Invalid email");
  }

  // 5. Validate phone
  if (typeof analysis.phone !== "string") {
    throw new Error("Invalid phone");
  }

  // 6. Validate ATS score
  if (
    typeof analysis.ats_score !== "number" ||
    analysis.ats_score < 0 ||
    analysis.ats_score > 100
  ) {
    throw new Error("Invalid ATS score");
  }

  // 7. Validate array fields
  const arrayFields = [
    "skills",
    "education",
    "experience",
    "projects",
    "certifications",
    "strengths",
    "weaknesses",
    "missing_skills",
    "interview_questions",
  ];

  for (const field of arrayFields) {
    if (!Array.isArray(analysis[field])) {
      throw new Error(`${field} must be an array`);
    }
  }

  // 8. Validate summary
  if (typeof analysis.summary !== "string") {
    throw new Error("Invalid summary");
  }

  return true;
};

export const validateAIJobMatch = (analysis)=>{
  if (!analysis || typeof analysis !== "object") {
    throw new Error("AI match response is not a valid object");
  }

  if (
    typeof analysis.match_score !== "number" ||
    analysis.match_score < 0 ||
    analysis.match_score > 100
  ) {
    throw new Error("Invalid match_score");
  }

  const arrayFields = [
    "matched_skills",
    "missing_skills",
  ];

  for (const field of arrayFields) {
    if (!Array.isArray(analysis[field])) {
      throw new Error(`${field} must be an array`);
    }
  }

  const stringFields = [
    "experience_match",
    "recommendation",
    "summary",
  ];

  for (const field of stringFields) {
    if (typeof analysis[field] !== "string") {
      throw new Error(`${field} must be a string`);
    }
  }

  return true;
};
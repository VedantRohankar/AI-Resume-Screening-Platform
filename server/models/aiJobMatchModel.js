import db from "../config/db.js";

export const createAIJobMatch = async (
  applicationId,
  matchScore,
  matchedSkills,
  missingSkills,
  experienceMatch,
  recommendation,
  summary,
  analysisData
) => {
  const result = await db.query(
    `
    INSERT INTO ai_job_matches
    (
        application_id,
        match_score,
        matched_skills,
        missing_skills,
        experience_match,
        recommendation,
        summary,
        analysis_data
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `, [
      applicationId, // Removed userId!
      matchScore,    // Fixed &2 to $2!
      matchedSkills,
      missingSkills,
      experienceMatch,
      recommendation,
      summary,
      analysisData
    ]
  );
  return result.rows[0];
};

export const getAIJobByApplication = async (applicationId) => {
  const result = await db.query(
    `
    SELECT * FROM ai_job_matches
    WHERE application_id = $1
    `, [applicationId]
  );
  return result.rows[0];
};

export const updateAIJobMatch = async (
  applicationId,
  matchScore,
  matchedSkills,
  missingSkills,
  experienceMatch,
  recommendation,
  summary,
  analysisData
) => {
  const result = await db.query(
    `
    UPDATE ai_job_matches
    SET  
      match_score = $1,
      matched_skills = $2,
      missing_skills = $3,
      experience_match = $4,
      recommendation = $5,
      summary = $6,
      analysis_data = $7
    WHERE application_id = $8
    RETURNING *;
    `, [
      matchScore,
      matchedSkills,
      missingSkills,
      experienceMatch,
      recommendation,
      summary,
      analysisData,
      applicationId
    ]
  );
  return result.rows[0];
};
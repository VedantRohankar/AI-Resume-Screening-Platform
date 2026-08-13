import db from '../config/db.js';

export const createResumeAnalysis = async (
  resumeId,
  score,
  summary,
  skills,
  missing_skills,
  suggestions
) => {
  const result = await db.query(`
    INSERT INTO resume_analysis
    (
    resume_id,
    score,
    summary,
    skills,
    missing_skills,
    suggestions
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `, [
      resumeId,
      score,
      summary,
      skills,
      missing_skills,
      suggestions,
    ]
  );
   return result.rows[0];
};

export const getResumeAnalysisByResumeId = async (resumeId) => {
  const result = await db.query(
    `
    SELECT * FROM resume_analysis
    WHERE resume_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,[resumeId]
  );
  return result.rows[0];
};
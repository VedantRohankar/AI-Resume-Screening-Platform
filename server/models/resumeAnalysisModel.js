import db from '../config/db.js';

export const createResumeAnalysis = async (resumeId, analysis) => {
  const result = await db.query(`
    INSERT INTO resume_analysis
    (
    resume_id,
    score,
    summary,
    skills,
    missing_skills,
    suggestions,
    analysis_data
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [
      resumeId,
      analysis.ats_score,
      analysis.summary,
      analysis.skills.join(", "),
      analysis.missing_skills.join(", "),
      analysis.strengths.join(", "),
      JSON.stringify(analysis)

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

export const updateResumeAnalysis = async (
  resumeId,
  analysis
) => {
  const result = await db.query(
    `
    UPDATE resume_analysis
    SET
    score = $1,
    summary = $2,
    skills = $3,
    missing_skills = $4,
    suggestions = $5,
    WHERE resume_id = $6,
    analysis_data = $7,
    RETURNING *;
    `,
    [
      analysis.ats_score,
      analysis.summary,
      analysis.skills.join(", "),
      analysis.missing_skills.join(", "),
      analysis.strengths.join(", "),
      JSON.stringify(analysis),
      resumeId
    ]
  );
  return result.rows[0];
}
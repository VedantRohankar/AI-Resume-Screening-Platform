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
      analysis_data = $6
    WHERE resume_id = $7
    RETURNING *;
    `,
    [
      analysis.ats_score,
      analysis.summary,
      analysis.skills.join(", "),
      analysis.missing_skills.join(", "),
      analysis.strengths.join(", "),
      JSON.stringify(analysis), // This is now $6
      resumeId                  // This is now $7
    ]
  );
  return result.rows[0];
};

export const getAIResumeAnalysisByCandidateId = async (candidateId) => {
  const result = await db.query(
    `
    SELECT 
      ra.id,
      r.candidate_id,
      ra.skills,
      ra.summary,
      ra.analysis_data
    FROM resume_analysis ra
    INNER JOIN resumes r ON ra.resume_id = r.id
    WHERE r.candidate_id = $1
    ORDER BY ra.created_at DESC
    LIMIT 1;
    `, [candidateId]
  );
  return result.rows[0];
}
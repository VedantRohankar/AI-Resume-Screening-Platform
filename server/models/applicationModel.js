import db from '../config/db.js';

//Candidate Applies For Job
export const createApplication = async (jobId,candidateId) => {
  const result = await db.query(
    `
    INSERT INTO applications(
    job_id,
    candidate_id
    )
    VALUES ($1, $2)
    RETURNING *;
    `,
    [jobId,candidateId]
  );

  return result.rows[0];
};

//Get all applications of a candidate with job & AI match details
export const getCandidateApplication = async (candidateId) => {
  const result = await db.query(
    `
    SELECT 
      a.id,
      a.job_id,
      a.candidate_id,
      a.status,
      a.applied_at,
      j.title,
      j.location,
      j.salary,
      j.job_type,
      c.company_name,
      c.company_logo,
      m.match_score,
      m.recommendation,
      m.matched_skills,
      m.missing_skills,
      m.experience_match,
      m.summary AS ai_summary,
      m.analysis_data AS ai_match_data
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN ai_job_matches m ON a.id = m.application_id
    WHERE a.candidate_id = $1
    ORDER BY a.applied_at DESC
    `,
    [candidateId]
  );
  return result.rows;
};

//Get Applicants for a job with candidate profile & AI score
export const getApplicantsByJob = async (jobId) => {
  const result = await db.query(
    `
    SELECT 
      a.id,
      a.job_id,
      a.candidate_id,
      a.status,
      a.applied_at,
      u.username AS candidate_name,
      u.email AS candidate_email,
      r.resume_url,
      m.match_score,
      m.recommendation,
      m.matched_skills,
      m.missing_skills,
      m.experience_match,
      m.summary AS ai_summary,
      m.analysis_data AS ai_match_data
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    LEFT JOIN resumes r ON u.id = r.candidate_id
    LEFT JOIN ai_job_matches m ON a.id = m.application_id
    WHERE a.job_id = $1
    ORDER BY m.match_score DESC NULLS LAST, a.applied_at DESC
    `,
    [jobId]
  );
  return result.rows;
};

//Update Application Status
export const updateApplicationStatus = async (ApplicationId,status) => {
  const result = await db.query(
    `UPDATE applications
    SET status = $1
    WHERE id = $2
    RETURNING *;
    `,
    [status,ApplicationId]
  );
  return result.rows[0];
  
};

//Get Application for AI Matching

export const getApplicationForAIMatching = async (applicationId) => {
  const result = await db.query(
    `
    SELECT
      a.id AS application_id,
      a.candidate_id,
      a.job_id,

      u.id AS user_id,
      u.username,
      u.email,

      j.id AS job_id,
      j.title,
      j.description,
      j.requirements,
      j.experience_level

    FROM applications a

    JOIN users u
      ON a.candidate_id = u.id

    JOIN jobs j
      ON a.job_id = j.id

    WHERE a.id = $1;
    `,
    [applicationId]
  );

  return result.rows[0];
};
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

//Get all applications of a candidate
export const getCandidateApplication = async (candidateId) => {
  const result = await db.query(
    `
    SELECT * FROM applications
    WHERE candidate_id = $1
    ORDER BY applied_at DESC
    `,
    [candidateId]
  );
  return result.rows;
};

//Get Applicants for a job
export const getApplicantsByJob = async (jobId) => {
  const result = await db.query(
    `SELECT * FROM applications
    WHERE job_id = $1
    ORDER BY applied_at DESC
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
import db from "../config/db.js";

export const createJob = async (
  companyId,
  title,
  description,
  requirements,
  location,
  job_type,
  salary,
  experience_level
) => {

  const result = await db.query(
    `
    INSERT INTO jobs(
      company_id,
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      companyId,
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level,
    ]
  );

  return result.rows[0];
};

export const getJobsByCompanyId = async (companyId) => {

  const result = await db.query(
    `
    SELECT *
    FROM jobs
    WHERE company_id = $1
    ORDER BY created_at DESC
    `,
    [companyId]
  );

  return result.rows;
};

export const getAllJobs = async () => {

  const result = await db.query(
    `
    SELECT *
    FROM jobs
    WHERE status = 'open'
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

export const getJobById = async (jobId) => {

  const result = await db.query(
    `
    SELECT *
    FROM jobs
    WHERE id = $1
    `,
    [jobId]
  );

  return result.rows[0];
};

export const updateJob = async (
  jobId,
  companyId,
  title,
  description,
  requirements,
  location,
  job_type,
  salary,
  experience_level,
  status
) => {

  const result = await db.query(
    `
    UPDATE jobs
    SET
      title = $1,
      description = $2,
      requirements = $3,
      location = $4,
      job_type = $5,
      salary = $6,
      experience_level = $7,
      status = $8,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $9
    AND company_id = $10
    RETURNING *;
    `,
    [
      title,
      description,
      requirements,
      location,
      job_type,
      salary,
      experience_level,
      status,
      jobId,
      companyId,
    ]
  );

  return result.rows[0];
};

export const deleteJob = async (jobId, companyId) => {

  await db.query(
    `
    DELETE FROM jobs
    WHERE id = $1
    AND company_id = $2
    `,
    [jobId, companyId]
  );

};
import db from '../config/db.js';

export const createCompany = async (
  recruiterId,
  company_name,
  industry,
  website,
  description,
  location,
  company_logo,
) => {
  const result = await db.query(
    `
    INSERT INTO companies(
      recruiter_id,
      company_name,
      industry,
      website,
      description,
      location,
      company_logo
    ) VALUES($1,$2,$3,$4,$5,$6,$7)
     RETURNING *;
    `,
      [recruiterId,
      company_name,
      industry,
      website,
      description,
      location,
      company_logo]
  );
  return result.rows[0];
};

export const getCompanyByRecruiterId = async (recruiterId) => {
  const result = await db.query(
    `
    SELECT * FROM companies
    WHERE recruiter_id = $1
    `,[recruiterId]
  );
  return result.rows[0];
};

export const updateCompany = async (
      recruiterId,
      company_name,
      industry,
      website,
      description,
      location,
      company_logo) => {
  const result = await db.query(
    `
      UPDATE companies
      SET
      company_name = $1,
      industry = $2,
      website = $3,
      description = $4,
      location = $5,
      company_logo = $6,
      updated_at = CURRENT_TIMESTAMP
      WHERE recruiter_id = $7
      RETURNING *;
    `,
    [
      company_name,
      industry,
      website,
      description,
      location,
      company_logo,
      recruiterId,
    ]
  );
  return result.rows[0];
};

export const deleteCompany = async (recruiterId) => {
  const result = await db.query(`
    DELETE FROM companies
    WHERE recruiter_id = $1
    `,
  [recruiterId]
  );
};
 export const getAllCompaniesAdmin = async () => {
    console.log("getting companies");
    const result = await db.query(
      `
      SELECT * FROM companies
      ORDER BY created_at DESC
      `
    );
    return result.rows;
 };

 export const deleteCompanyById = async (id) => {
  const result = await db.query(
    `
     DELETE FROM companies
     WHERE id = $1
     RETURNING *; 
    `,
    [id]
  );
  return result.rows[0];
 }
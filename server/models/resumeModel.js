import db from "../config/db.js";

export const createResume = async (
  candidateId,
  resumeUrl,
  fileName,
  fileSize
) => {
  const result = await db.query(
    `
    INSERT INTO resumes(
    candidate_id,
    resume_url,
    file_name,
    file_size
    )
    VALUES($1,$2,$3,$4)
    RETURNING *;
    `,
    [candidateId,
  resumeUrl,
  fileName,
  fileSize,
]
  );

  return result.rows[0];
};

export const getResumeByCandidateId = async (candidateId) => {
  const result = await db.query(
    `
    SELECT * FROM resumes
    WHERE candidate_id = $1
    `,
    [candidateId]
  );
  return result.rows[0];
};


export const deleteResume = async (candidateId) => {
  await db.query(
    `
    DELETE FROM resumes
    WHERE candidate_id = $1
    `,
    [candidateId]
  );

  
};
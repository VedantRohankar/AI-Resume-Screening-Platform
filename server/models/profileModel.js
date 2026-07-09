import db from "../config/db.js";

export const createProfile = async (
  userId,
  full_name,
  phone,
  address,
  bio,
  experience,
  education,
  skills,
  linkedin_url,
  github_url,
  portfolio_url,
  profile_photo
)=>{
  const result = await db.query(
    `INSERT INTO profiles(
  user_id,
  full_name,
  phone,
  address,
  bio,
  experience,
   education,
  skills,
  linkedin_url,
  github_url,
  portfolio_url,
  profile_photo
    )
  VALUES(
  $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
  )
    RETURNING *; 
    `,
    [
  userId,
  full_name,
  phone,
  address,
  bio,
  experience,
  education,
  skills,
  linkedin_url,
  github_url,
  portfolio_url,
  profile_photo
    ]
  );

  return result.rows[0];
};

export const getProfileByUserId = async (userId) => {
  const result = await db.query(
    `
    SELECT * FROM profiles
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
};

export const updateProfile = async (
  userId,
  full_name,
  phone,
  address,
  bio,
  experience,
  education,
  skills,
  linkedin_url,
  github_url,
  portfolio_url,
  profile_photo
) => {
  const result = await db.query(
    `
    UPDATE profiles 
    SET
      full_name = $1,
      phone = $2,
      address = $3,
      bio = $4,
      experience = $5,
      education = $6,
      skills = $7,
      linkedin_url = $8,
      github_url = $9,
      portfolio_url = $10,
      profile_photo = $11,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $12
    RETURNING *;
    `,
    [
      full_name,
      phone,
      address,
      bio,
      experience,
      education,
      skills,
      linkedin_url,
      github_url,
      portfolio_url,
      profile_photo,
      userId,
    ]
  );

  return result.rows[0];

};
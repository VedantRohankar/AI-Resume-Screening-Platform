import db from "../config/db.js";

export const createUser = async (
  username,
  email,
  password,
  role,
  verificationToken,
  tokenExpiresAt     
) => {
  const result = await db.query(`
  INSERT INTO users (username, email, password, role, verification_token, token_expires_at)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `,[username, email, password, role, verificationToken, tokenExpiresAt]
);
  return result.rows[0];
};

export const findUserEmail = async (email)=>{
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,[email]
  );

  return result.rows[0];
};

export const getUserById = async(id)=>{
  console.log("Fetching User from DataBase!");
  
  const result = await db.query(`
    SELECT id,username,email,role,created_at
    FROM users
    Where id = $1`,[id]
  );
  return result.rows[0];
};

export const getAllUsers = async()=>{
  console.log("getting users");
   
  const result = await db.query(`
    SELECT id,username,email,role,created_at
    FROM users
    ORDER BY created_at DESC
    `);

    return result.rows;
  
};

export const deleteUserId = async (id) => {
  const result = await db.query(
    `
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
    `,
    [id]
  );
  return result.rows[0];
};

export const findUserByToken = async (token) => {
  const result = await db.query(
    `
    SELECT * FROM users
    WHERE verification_token = $1
    `,[token]
  );
  return result.rows[0];
};

export const verifyUserAccount = async (userId) => {
  const result = await db.query(
    `
    UPDATE users
    SET is_verified = true,
    verification_token = NULL,
    token_expires_at = NULL
    WHERE id = $1
    `,[userId]
  );
  return result.rows[0];
};

export const updateUserPassword = async (userId, hashedPassword) => {
  const result = await db.query(
    `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING id, email;
    `,[hashedPassword,userId]
  );
  return result.rows[0];
};
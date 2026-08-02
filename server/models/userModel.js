import db from "../config/db.js";

export const createUser = async(username,email,password,role)=>{
  const query=`
  INSERT INTO users (username,email,password,role)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

const values = [username,email,password,role];

const result = await db.query(query,values);
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
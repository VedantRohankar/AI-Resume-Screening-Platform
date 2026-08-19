import db from '../config/db.js';

export const createResetToken = async (
  userId,
  tokenHash,
  expiresAt
) => {
  const result = await db.query(
    `
    INSERT INTO password_reset_token
    (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,[userId,tokenHash,expiresAt]
  );
  return result.rows[0];
};

export const findResetToken = async (tokenHash) => {
  const result = await db.query(
    `
    SELECT * FROM password_reset_token
    WHERE token_hash = $1,
    `,[tokenHash]
  );
  return result.rows[0];
};

export const markResetTokenUsed = async (tokenId) => {
  const result = await db.query(
    `
    UPDATE password_reset_token
    SET used_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
    `,[tokenId]
  );
  return result.rows[0];
};
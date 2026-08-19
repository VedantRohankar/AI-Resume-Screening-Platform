import crypto from 'crypto';

export const generateResetToken = ()=>{
  const resetToken = crypto.randomBytes(32).toString("hex");

  return resetToken;
};

export const hashResetToken = (token)=>{
  return crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
};
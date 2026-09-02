import bcrypt from "bcrypt";
import { createUser,findUserEmail, findUserByToken, verifyUserAccount, updateUserPassword} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {sendWelcomeEmail, sendVerificationEmail} from '../services/emailServices.js';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import {generateResetToken, hashResetToken} from '../services/passwordResetService.js';
import {createResetToken, findResetToken,markResetTokenUsed} from '../models/passwordResetModel.js';
import {sendPasswordResetEmail} from '../services/emailServices.js';


export const register = catchAsync(async (req, res, next) => {
    const {username, email, password, role} = req.body;

     // Allow only candidate and recruiter roles
    const allowedRoles = ["candidate", "recruiter"];

    if (!allowedRoles.includes(role)) {
      return next(new AppError("Role must be candidate or recruiter", 400));
    }

     // Check if user already exists
    const existingUser = await findUserEmail(email);
    if(existingUser){
      return next(new AppError("User Already Exists", 400));
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password,10);

    //--New : Generate Crypto Token--
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours()+24);

    // Create User
    const user = await createUser(
      username,
      email,
      hashedPassword,
      role,
      verificationToken,
      tokenExpiresAt
    );
    //! Verification Email (Dispatched in background so client response never times out):
    sendVerificationEmail(email, username, verificationToken)
      .then(() => console.log("✅ Verification Email sent to:", email))
      .catch((err) => console.warn("⚠️ Email delivery warning (check SMTP on Render):", err.message));

    const clientBaseUrl = (process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, '');
    console.log(`🔑 Verification Link for ${email}: ${clientBaseUrl}/api/auth/verify?token=${verificationToken}`);

    return res.status(200).json({
      message: "User Registered Successfully! Please check your email to verify your account.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
});

export const login = catchAsync(async (req, res, next) => { 
  
  const {email, password} = req.body;

  const user = await findUserEmail(email);

  if(!user){
    return next(new AppError("Invalid Email or Password", 400));
  }
  
  if (!user.is_verified) {
    return next(new AppError("Please verify your email address before logging in.", 403)); 
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    return next(new AppError("Invalid Email or Password", 400));
  }

  const token = jwt.sign(
    { 
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login Successful",
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });

});

export const verifyEmail = async (req, res) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
  const isHtmlRequest = req.headers.accept && req.headers.accept.includes('text/html');

  try {
    // 1. Grab the token from the URL
    const { token } = req.query;

    if (!token) {
      if (isHtmlRequest) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>HireAI - Verification Error</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0; background:#090d16; color:#f8fafc; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:20px;">
            <div style="background:#0f172a; border:1px solid #1e293b; padding:40px; border-radius:16px; max-width:440px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="font-size:36px; margin-bottom:12px;">⚠️</div>
              <h2 style="color:#f43f5e; margin:0 0 10px;">Token Missing</h2>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">Verification token is missing from the link.</p>
              <a href="${clientUrl}/login" style="display:inline-block; margin-top:20px; background:#6366f1; color:#fff; padding:10px 24px; border-radius:10px; text-decoration:none; font-weight:600; font-size:14px;">Go to Sign In</a>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(400).json({ message: "Verification token is missing." });
    }

    // 2. Find the user by the token
    const user = await findUserByToken(token);

    if (!user) {
      if (isHtmlRequest) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>HireAI - Verification Error</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0; background:#090d16; color:#f8fafc; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:20px;">
            <div style="background:#0f172a; border:1px solid #1e293b; padding:40px; border-radius:16px; max-width:440px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="font-size:36px; margin-bottom:12px;">❌</div>
              <h2 style="color:#f43f5e; margin:0 0 10px;">Invalid Token</h2>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">This verification link is invalid or has already been used.</p>
              <a href="${clientUrl}/login" style="display:inline-block; margin-top:20px; background:#6366f1; color:#fff; padding:10px 24px; border-radius:10px; text-decoration:none; font-weight:600; font-size:14px;">Go to Sign In</a>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // 3. Check if the 24 hours have passed
    const currentTime = new Date();
    const expirationTime = new Date(user.token_expires_at);

    if (currentTime > expirationTime) {
      if (isHtmlRequest) {
        return res.status(400).send(`
          <!DOCTYPE html>
          <html>
          <head><title>HireAI - Token Expired</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin:0; background:#090d16; color:#f8fafc; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:20px;">
            <div style="background:#0f172a; border:1px solid #1e293b; padding:40px; border-radius:16px; max-width:440px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="font-size:36px; margin-bottom:12px;">⏳</div>
              <h2 style="color:#f59e0b; margin:0 0 10px;">Token Expired</h2>
              <p style="color:#94a3b8; font-size:14px; line-height:1.6;">This link has expired (valid for 24h). Please register again.</p>
              <a href="${clientUrl}/register" style="display:inline-block; margin-top:20px; background:#6366f1; color:#fff; padding:10px 24px; border-radius:10px; text-decoration:none; font-weight:600; font-size:14px;">Register Again</a>
            </div>
          </body>
          </html>
        `);
      }
      return res.status(400).json({ message: "Verification token has expired. Please register again." });
    }

    // 4. Update the user account to is_verified = true
    const verifiedUser = await verifyUserAccount(user.id);

    // 5. Send Welcome Email
    try {
      await sendWelcomeEmail(verifiedUser.email, verifiedUser.username);
      console.log("Welcome Email sent to verified user:", verifiedUser.email);
    } catch (emailError) {
      console.error("Failed to send Welcome Email:", emailError);
    }

    if (isHtmlRequest) {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>HireAI - Email Verified Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0; background:#090d16; color:#f8fafc; font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:20px;">
          <div style="background:#0f172a; border:1px solid #334155; padding:40px; border-radius:20px; max-width:460px; width:100%; box-shadow:0 25px 50px -12px rgba(99,102,241,0.25);">
            <div style="width:60px; height:60px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:28px;">
              ✅
            </div>
            <h2 style="color:#ffffff; margin:0 0 8px; font-size:22px;">Email Verified!</h2>
            <p style="color:#94a3b8; font-size:14px; line-height:1.6; margin:0 0 24px;">
              Welcome, <strong style="color:#e2e8f0;">${verifiedUser.username}</strong>! Your account is now active and ready to use.
            </p>
            <a href="${clientUrl}/login" style="display:inline-block; background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#ffffff; padding:12px 28px; border-radius:12px; text-decoration:none; font-weight:700; font-size:14px; box-shadow:0 10px 15px -3px rgba(99,102,241,0.4);">
              Sign In to HireAI
            </a>
          </div>
        </body>
        </html>
      `);
    }

    res.status(200).json({
      message: "Email successfully verified! You can now log in.",
      user: verifiedUser
    });

  } catch (error) {
    console.error("Verification Error:", error);
    if (isHtmlRequest) {
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head><title>HireAI - Server Error</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0; background:#090d16; color:#f8fafc; font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; padding:20px;">
          <div style="background:#0f172a; border:1px solid #1e293b; padding:40px; border-radius:16px; max-width:440px; width:100%;">
            <h2 style="color:#f43f5e; margin:0 0 10px;">Server Error</h2>
            <p style="color:#94a3b8; font-size:14px;">An error occurred during verification. Please try again.</p>
            <a href="${clientUrl}/login" style="display:inline-block; margin-top:20px; background:#6366f1; color:#fff; padding:10px 24px; border-radius:10px; text-decoration:none; font-weight:600; font-size:14px;">Go to Sign In</a>
          </div>
        </body>
        </html>
      `);
    }
    res.status(500).json({ message: "Server Error during verification." });
  }
};

//! FORGOT PASSWORD FLOW:

//Find users email
export const forgotPassword = catchAsync(async (req,res) => {
  const {email} = req.body;

  const user = await findUserEmail(email);

  if (!user) {
    return res.status(404).json({
      message: 'User Not Found',
    });
  }
  console.log("User Found:",user.email);
//Generate Reset Token
  const resetToken = generateResetToken();
  console.log("Reset Token:",resetToken);

//Hash Reset Token
const hashToken = hashResetToken(resetToken);
console.log("Hash Token:",hashToken);

//Calculate Expiry
const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

// Reset Token Password Record
const resetTokenRecord = await createResetToken (
  user.id,
  hashToken,
  expiresAt
);
// Send the token to the email
sendPasswordResetEmail(user.email, user.username, resetToken)
  .then(() => console.log("✅ Password reset email sent to:", user.email))
  .catch((err) => console.warn("⚠️ Reset email notice:", err.message));

const clientBaseUrl = (process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, '');
console.log(`🔑 Password Reset Link for ${user.email}: ${clientBaseUrl}/reset-password?token=${resetToken}`);

return res.status(200).json({
  message: "Password Reset link sent Successfully",
});
});

export const resetPassword = catchAsync(async (req,res) => {
  //Retreive token and newPassword
  const {token, newPassword} = req.body;

  //Hash the Token
  const tokenHash = hashResetToken(token);
  //
  const resetToken = await findResetToken(tokenHash);

  if (!resetToken) {
    return res.status(400).json({
      message: 'Invalid or Expired reset Token',
    });
  }
//Check wheather the token is expired or not
 if (new Date()> new Date(resetToken.expires_at)) {
    return res.status(400).json({
      message: "Reset token has expired",
    });
 }

 //Check weather the token is already used or not
 if (resetToken.used_at) {
  return res.status(400).json({
    message: 'Token is already been used',
  });
 }
//Hash the new Password
 const hashedPassword = await bcrypt.hash(newPassword,10);

 //Update Users Password
 const updatedUser = await updateUserPassword(
  resetToken.user_id,
  hashedPassword
 );

 //Mark Reset token as Used.
await markResetTokenUsed(resetToken.id);
 return res.status(200).json({
  message: 'Password reset successfully',
 });


});



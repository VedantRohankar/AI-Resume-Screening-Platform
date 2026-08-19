import bcrypt from "bcrypt";
import { createUser,findUserEmail, findUserByToken, verifyUserAccount} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {sendWelcomeEmail, sendVerificationEmail} from '../services/emailServices.js';
import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import {generateResetToken, hashResetToken} from '../services/passwordResetService.js';
import {createResetToken} from '../models/passwordResetModel.js';
import {sendPasswordResetEmail} from '../services/emailServices.js';

export const register = catchAsync( async (req,res)=>{
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
    //!Verification Email Notif:
    try {
      await sendVerificationEmail(email, username, verificationToken);
      console.log("Verification Email sent to:",email);
      
    } catch (error) {
      console.log("Failed to send Verification Email:",error);
    }

    
     res.status(200).json({
      message:"User Registered Successfully,Please check your email to verify your account.",
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
    },
  });

});

export const verifyEmail = async (req, res) => {
  try {
    // 1. Grab the token from the URL
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is missing." });
    }

    // 2. Find the user by the token
    const user = await findUserByToken(token);

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // 3. Check if the 24 hours have passed
    const currentTime = new Date();
    const expirationTime = new Date(user.token_expires_at);

    if (currentTime > expirationTime) {
      return res.status(400).json({ message: "Verification token has expired. Please register again." });
    }

    // 4. Update the user account to is_verified = true
    const verifiedUser = await verifyUserAccount(user.id);

    // 5. Send the Welcome Email now that they are officially verified!
    try {
      await sendWelcomeEmail(verifiedUser.email, verifiedUser.username);
      console.log("Welcome Email sent to verified user:", verifiedUser.email);
    } catch (emailError) {
      console.error("Failed to send Welcome Email:", emailError);
    }

    res.status(200).json({
      message: "Email successfully verified! You can now log in.",
      user: verifiedUser
    });

  } catch (error) {
    console.error("Verification Error:", error);
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
await sendPasswordResetEmail(
  user.email,
  user.username,
  resetToken
);
 return res.status(200).json({
  message: "Password Reset link sent Successfully",
 });

});





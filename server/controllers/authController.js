import bcrypt from "bcrypt";
import { createUser,findUserEmail, findUserByToken, verifyUserAccount} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {sendWelcomeEmail, sendVerificationEmail} from '../services/emailServices.js';
import crypto from 'crypto';

export const register = async (req,res)=>{
  try {
    const {username, email, password, role} = req.body;

     // Allow only candidate and recruiter roles
    const allowedRoles = ["candidate", "recruiter"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be candidate or recruiter",
      });
    }

     // Check if user already exists
    const existingUser = await findUserEmail(email);
    if(existingUser){
      return res.status(400).json({
        message: "User Already Exists",
      });
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

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
    
  }
};

export const login = async(req,res)=>{

  try {
    const {email,password} = req.body;

    const user = await findUserEmail(email);

    if(!user){
      return res.status(400).json({
        message:"Invalid Email or Password",
      });
    }
    //NEW: Block Unverified Users--
    if (!user.is_verified) {
      return res.status(403).json({
        message:"Please verify your email address before logging in."
      });
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({
        message:"Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {id:user.id,
        role:user.role,
      },
      process.env.JWT_SECRET,
      {expiresIn:"1h"}
    );

    res.status(200).json({
      message:"Login Successful",
      token,
      user:{
        id:user.id,
        username:user.username,
        email:user.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:"Server Error",
    });
  }
};

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
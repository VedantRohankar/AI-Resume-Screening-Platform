import bcrypt from "bcrypt";
import { createUser,findUserEmail } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {sendWelcomeEmail} from '../services/emailServices.js';

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

    // Create User
    const user = await createUser(
      username,
      email,
      hashedPassword,
      role
    );
    //!Welcome Email Notif
    try {
      await sendWelcomeEmail(email, username);
      console.log("Welcome Email sent to:",email);
      
    } catch (error) {
      console.error("Failed to send Welcome Email:",error);
      
      
    }
     res.status(200).json({
      message:"User Registered Successfully",
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
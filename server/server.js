import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import {errorMiddleware} from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users",candidateRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume",resumeRoutes);
app.use("/api/company",companyRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/test-error",(req,res,next)=>{
  const error = new AppError("Oops! This resume was not found.", 404);
  next(error);
});

app.get("/",(req,res)=>{
  res.send("HireAI API Running");
});

//Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});



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

dotenv.config();

const app = express();

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

app.get("/",(req,res)=>{
  res.send("Graphology API Running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`server running on port ${PORT}`);
});



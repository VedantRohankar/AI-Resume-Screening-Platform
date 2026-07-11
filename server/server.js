import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume",resumeRoutes);

app.get("/",(req,res)=>{
  res.send("Graphology API Running");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`server running on port ${PORT}`);
});



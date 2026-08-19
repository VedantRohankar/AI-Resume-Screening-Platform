import express from "express";
import { register,login, verifyEmail, forgotPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register);

router.post("/login",login);

router.get("/verify",verifyEmail);

router.post("/forgot-password",forgotPassword);

export default router;
import express from "express";
import {createRecruiterCompany, getCompany, editCompany, removeCompany} from "../controllers/companyController.js";
import {verifyToken} from "../middleware/authMiddleware.js";
import {isRecruiter} from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/",verifyToken,isRecruiter,createRecruiterCompany);

router.get("/",verifyToken,isRecruiter,getCompany);

router.patch("/",verifyToken,isRecruiter,editCompany);

router.delete("/",verifyToken,isRecruiter,removeCompany);

export default router;
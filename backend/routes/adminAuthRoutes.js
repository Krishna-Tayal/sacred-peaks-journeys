import express from "express";
import { adminLogin, sendOtp, changePassword, changeEmail } from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/send-otp", sendOtp);
router.post("/change-password", changePassword);
router.put("/change-email", changeEmail);

export default router;

import express from "express";
import { login, signup, logout ,verifyEmail,forgotPassword,resetPassword,checkAuth} from "../controller/auth.contoller.js"; // Ensure correct path
import { verifyToken } from "../middleWare/verifyToken.js";
const router = express.Router();




router.get("/check-auth",verifyToken,checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);

export default router;

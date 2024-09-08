import express from "express";
import { login, signup, logout } from "../controller/auth.contoller.js"; // Ensure correct path

const router = express.Router();


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

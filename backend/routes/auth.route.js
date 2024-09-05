import express from "express";
import { login, signup, logout } from "../controller/auth.contoller.js"; // Ensure correct path

const router = express.Router();


router.get("/signup", signup);
router.get("/login", login);
router.get("/logout", logout);

export default router;

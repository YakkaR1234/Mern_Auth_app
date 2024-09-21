import { generateKey } from "crypto";
import { User } from "../model/user.model.js";
import bycrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { send } from "process";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All  fields are required");
    }
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ succuess: true, message: "user already exist!" });
    }

    const hashedPassword = await bycrypt.hash(password, 10);
    const verificationToken = Math.floor(
      1000 + Math.random() * 90000
    ).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    });
    
    await user.save();
    
    console.log("User saved:", user); // Log the user object after saving
    

    //jwt
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      succuess: true,
      message: "User created  succesfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(400).json({ succuess: false, message: error.message });
  }
  
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    console.log(user)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification number",
      });
    }

    // Log the token from the user if needed
    console.log("User data:", user);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt=undefined; 
    
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



export const login = async (req, res) => {
  res.send("Login page");
};

export const logout = async (req, res) => {
  res.send("Logout page");
};


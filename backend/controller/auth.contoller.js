import { User } from "../model/user.model.js";
import bycrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { send } from "process";
import { sendPassowordRestEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto"

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
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

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
    //console.log(user)

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
    user.verificationTokenExpiresAt = undefined;

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
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body; // Corrected "passowrd" to "password"
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bycrypt.compare(password, user.password); // Corrected "bycrypt" and "passowrd"
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ // Changed status to 200
      success: true, // Corrected "succuess" to "success"
      message: "User logged in successfully", // Corrected "loged" to "logged"
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword=async (req,res)=>{
  const {email}=req.body;
  try{
    const user=await User.findOne({email});
    if (!user){
      return res.status(400).json({success:false,message:"User not found"});
    }

    const resetToken=crypto.randomBytes(20).toString("hex");
    const resetTokeneExpireAt=Date.now()+1*60*60*1000;

    user.resetPasswordToken=resetToken;
    user.resetPasswordExpiresAt=resetTokeneExpireAt;
    await user.save();

    await sendPassowordRestEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({success:true,message:"Passowrd reset link reset  to your email"});

  }catch(error)
  {
    console.log("Error in forgetpassword ",error);
    res.status(400).json({success:false,message:error.message});

  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bycrypt.hash(password, 10);

    // Update user's password and reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    // Send success email
    await sendResetSuccessEmail(user.email);

    // Respond with success message
    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    // Log the full error
    console.error("Error in resetPassword:", error);

    // Respond with the error
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message, // Include the error message in the response
    });
  }
};

export const checkAuth=async(req,res)=>{
  try {
    const user=await User.findById(req.userId).select("-password");
    if(!user){
      return res.status(400).json({success: false, message: "user not found"})
    }
    res.status(200).json({success:true,user})
  } catch (error) {
    return res.status(400).json({success: false, message:error.message})

  }
}
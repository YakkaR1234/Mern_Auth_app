import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    lastLogin: {
      type: Date, // Change this to Date instead of String
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String, // Fixed the typo
    resetPasswordExpiresAt: Date, // Fixed the typo
    verificationToken: String,
    verificationTokenExpiresAt: Date, // Ensure consistency with this field name
  }, { timestamps: true });
  


export const User=mongoose.model('User',userschema);
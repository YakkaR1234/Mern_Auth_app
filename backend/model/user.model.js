import mongoose from "mongoose";

const userschema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastLogin:{
        type:String,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    ressetPasswordToken: String,
    ressetPassowrdExpiresAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},{timestamps:true});


export const user=mongoose.model('User',userschema);
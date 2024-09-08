import { generateKey } from 'crypto';
import {User} from '../model/user.model.js';
import bycrypt from 'bcryptjs';
import {generateTokenAndSetCookie} from '../utils/generateTokenAndSetCookie.js'

export const signup = async (req, res) => {
const {email,password,name}=req.body;
    try{
        if(!email || !password|| !name){
            throw new Error("All  fields are required");
        }
        const userAlreadyExists=await User.findOne({email});

        if(userAlreadyExists){
            return res.status(400).json({succuess:true,message:"user already exist!"});
        }

        const hashedPassword= await bycrypt.hash(password,10);
        const verificationToken= Math.floor(1000+Math.random()*90000).toString();;

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpireAt:Date.now+24*60*60*1000,

        })
        await user.save(); //save to the databse 

        //jwt
        generateTokenAndSetCookie(res,user._id);
        
        res.status(201).json({
            succuess:true,
            message:"User created  succesfully",
            user:{
                ...user._doc,
                password:undefined,
            }
        });

    }catch(error){
    return res.status(400).json({succuess:false,message:error.message});

    }
};

export const login = async (req, res) => {
    res.send("Login page");
};

export const logout = async (req, res) => {
    res.send("Logout page");
};

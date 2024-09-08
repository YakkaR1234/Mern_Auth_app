import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookie=(res,userId)=>{

    const token=jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    //create the tokoen

    res.cookie("token",token,{
        httpOnly:true, //avoid xss attacks
        secure:process.env.NODE_ENV="Production",
        sameSite:"strict", //avaoid from csrf attacks
        maxAge:7*24*60*60*1000,
    });

    return token;

}
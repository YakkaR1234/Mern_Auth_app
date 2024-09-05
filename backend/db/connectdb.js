import mongoose from "mongoose";

export  const  connectdb= async () =>{
    try{
       
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongo connected: ${conn.connection.host}`);
    }catch(error){
        
        console.log("Error  connection to Mongodb :",error.message);
        process.exit(1); //1is faliure.0 is sucsess

    }
}
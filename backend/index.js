import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./db/connectdb.js";
import authRouter from "./routes/auth.route.js"; 
import cookieParser from "cookie-parser";
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); //allows us to  parse incomng requests..Eg:req.body
app.use(cookieParser()); //allow us to pass the incoming cookiers

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter); 

app.listen(PORT, () => {
    connectdb();
    console.log("Server is running on port 3000");
});

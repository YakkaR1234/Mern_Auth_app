import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./db/connectdb.js";
import authRouter from "./routes/auth.route.js"; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json()); //allows us to  parse incomng requests..Eg:req.body

app.use("/api/auth", authRouter); 

app.listen(PORT, () => {
    connectdb();
    console.log("Server is running on port 3000");
});

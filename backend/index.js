import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./db/connectdb.js";
import authRouter from "./routes/auth.route.js"; 

dotenv.config();
const app = express();


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/auth", authRouter); 

app.listen(5000, () => {
    connectdb();
    console.log("Server is running on port 3000");
});

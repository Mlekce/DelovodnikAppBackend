import express from "express";
import bcrypt from "bcrypt";
import mysql2 from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

function errorHandler(err, req, res, next) {
  console.error("Greška:", err.message);

  const status = err.status || 500;
  const poruka = err.message || "Greška na serveru";

  res.status(status).json({ poruka });
}

app.listen(4000, (error) => {
    if(error){
        console.error(error.message)
    }
    console.log("Server started at port 4000");

} 
    
)
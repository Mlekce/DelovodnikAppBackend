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
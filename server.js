const express = require("express");
const cors = require("cors");
require('dotenv').config()
const path = require('path');

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes.js");
const predmetRoutes = require("./routes/predmetRoutes.js");

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/avatars", express.static(path.join(__dirname, "uploads", "avatars")));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.use(authRoutes);
app.use(predmetRoutes);
app.use(userRoutes);
app.use(errorHandler);

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
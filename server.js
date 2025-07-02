const express = require("express");
const cors = require("cors");
require('dotenv').config()

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
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
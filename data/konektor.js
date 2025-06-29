const mysql2 = require("mysql2/promise");
require("dotenv").config();
let pool;

async function getPool() {
  if (!pool) {
    try {
      pool = mysql2.createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        port: process.env.SQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      await pool.query("SELECT 1");
    } catch (error) {
      console.error("Greška pri konekciji sa bazom:", error);
      throw new Error("Neuspešno povezivanje sa bazom podataka.");
    }
  }

  return pool;
}

module.exports = getPool;

// config/db.js
const mysql = require("mysql");
const db = mysql.createConnection({
  host     : process.env.DB_HOST     || "localhost",
  user     : process.env.DB_USER     || "root",
  password : process.env.DB_PASSWORD || "",
  database : process.env.DB_NAME     || "gamrate"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Greška pri povezivanju na bazu:", err);
    process.exit(1);
  }
  console.log("✅ Povezan sa MySQL bazom (XAMPP)!");
});

module.exports = db;

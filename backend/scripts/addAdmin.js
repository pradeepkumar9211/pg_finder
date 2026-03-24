const bcrypt = require("bcryptjs");
const db = require("./config/db");
require("dotenv").config();

const seed = async () => {
  const hashed = await bcrypt.hash("admin123", 12);
  await db.query(
    `INSERT INTO Admin (admin_id, admin_name, password, phone_no, email)
     VALUES (?, ?, ?, ?, ?)`,
    ["ADM001", "Super Admin", hashed, "9999999999", "admin@roomconnect.com"],
  );
  console.log("Admin created successfully");
  process.exit();
};

seed();

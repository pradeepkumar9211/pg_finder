require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const bcrypt = require("bcrypt");
const db = require("../config/db");

const addAdmin = async () => {
  const hashed = await bcrypt.hash("admin@123", 12);
  await db.query(
    `INSERT INTO Admin (admin_id, admin_name, password, phone_no, email)
     VALUES (?, ?, ?, ?, ?)`,
    ["ADM001", "Admin", hashed, "9999999999", "admin@mail.com"],
  );
  console.log("Admin created successfully");
  process.exit();
};

addAdmin();

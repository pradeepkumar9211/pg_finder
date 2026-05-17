require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../config/db");

async function seedAdmin() {
  try {
    const name = "Shifa";
    const email = "shifa@mail.com";
    const password = "Pradeep@123";

    // check if admin already exists
    const [existing] = await db.execute(`SELECT * FROM Admin WHERE email = ?`, [
      email,
    ]);
    if (existing.length > 0) {
      console.log("Admin already exists — skipping seed.");
      process.exit(0);
    }

    const admin_id = 'ADM001'
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO Admin (admin_id, admin_name, password, phone_no, email)
     VALUES (?, ?, ?, ?, ?)`,
      [admin_id, name, hashedPassword, "9999999999", email],
    );

    console.log("✅ Admin seeded successfully!");
    console.log(`   Email    : ${email}`);
    console.log(`   Password : ${password}`);
    console.log(`   ID       : ${admin_id}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedAdmin();

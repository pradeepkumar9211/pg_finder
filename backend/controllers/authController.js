const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  findUserByEmail,
  findUserById,
  createUser,
} = require("../models/authModel");

const TABLE_MAP = {
  admin: { table: "Admin", idCol: "admin_id", nameCol: "admin_name" },
  owner: { table: "PG_owner", idCol: "owner_id", nameCol: "owner_name" },
  tenant: { table: "Tenant", idCol: "tenant_id", nameCol: "tenant_name" },
};

const generateId = (role) => {
  const prefix = { admin: "ADM", owner: "OWN", tenant: "TNT" }[role];
  return `${prefix}${Date.now().toString().slice(-6)}`;
};

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { role, name, email, password, phone_no } = req.body;
    if (!role || !name || !email || !password || !phone_no) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const map = TABLE_MAP[role];
    if (!map) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const existing = await findUserByEmail(map.table, email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newId = generateId(role);

    await createUser(map.table, map.idCol, map.nameCol, {
      id: newId,
      name,
      email,
      password: hashedPassword,
      phone_no,
    });

    const token = signToken(newId, role);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: { id: newId, name, email, role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    const map = TABLE_MAP[role];
    if (!map) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const user = await findUserByEmail(map.table, email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    // Owner must be approved by admin before logging in
    if (role === "owner" && user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending admin approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const token = signToken(user[map.idCol], role);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user[map.idCol],
        name: user[map.nameCol],
        email: user.email,
        role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const { id, role } = req.user;

    const map = TABLE_MAP[role];
    const user = await findUserById(map.table, map.idCol, id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user[map.idCol],
        name: user[map.nameCol],
        email: user.email,
        phone_no: user.phone_no,
        role,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };

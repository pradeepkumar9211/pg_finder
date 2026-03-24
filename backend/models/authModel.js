const db = require("../config/db");

const findUserByEmail = async (table, email) => {
  const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [
    email,
  ]);
  return rows[0];
};

const findUserById = async (table, idCol, id) => {
  const [rows] = await db.query(`SELECT * FROM ${table} WHERE ${idCol} = ?`, [
    id,
  ]);
  return rows[0];
};

const createUser = async (table, idCol, nameCol, data) => {
  const { id, name, email, password, phone_no } = data;
  await db.query(
    `INSERT INTO ${table} (${idCol}, ${nameCol}, email, password, phone_no)
     VALUES (?, ?, ?, ?, ?)`,
    [id, name, email, password, phone_no],
  );
};

module.exports = { findUserByEmail, findUserById, createUser };

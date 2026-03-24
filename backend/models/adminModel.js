const db = require("../config/db");

const getAllOwners = async () => {
  const [rows] = await db.query(
    `SELECT owner_id, owner_name, email, phone_no, status, created_at
     FROM PG_owner
     ORDER BY created_at DESC`,
  );
  return rows;
};

const updateOwnerStatus = async (owner_id, status) => {
  await db.query(`UPDATE PG_owner SET status = ? WHERE owner_id = ?`, [
    status,
    owner_id,
  ]);
};

const findOwnerById = async (owner_id) => {
  const [rows] = await db.query(`SELECT * FROM PG_owner WHERE owner_id = ?`, [
    owner_id,
  ]);
  return rows[0];
};

const getAllTenants = async () => {
  const [rows] = await db.query(
    `SELECT tenant_id, tenant_name, email, phone_no, created_at
     FROM Tenant
     ORDER BY created_at DESC`,
  );
  return rows;
};

const getAllPGs = async () => {
  const [rows] = await db.query(
    `SELECT p.*, o.owner_name, o.email AS owner_email
     FROM PG_room p
     JOIN PG_owner o ON p.owner_id = o.owner_id
     ORDER BY p.pg_id DESC`,
  );
  return rows;
};

const updatePGStatus = async (pg_id, availability_status) => {
  await db.query(`UPDATE PG_room SET availability_status = ? WHERE pg_id = ?`, [
    availability_status,
    pg_id,
  ]);
};

const deletePGByAdmin = async (pg_id) => {
  await db.query(`DELETE FROM PG_room WHERE pg_id = ?`, [pg_id]);
};

const getAllBookings = async () => {
  const [rows] = await db.query(
    `SELECT b.*, t.tenant_name, p.pg_name, o.owner_name
     FROM Booking b
     JOIN Tenant t   ON b.tenant_id = t.tenant_id
     JOIN PG_room p  ON b.pg_id     = p.pg_id
     JOIN PG_owner o ON p.owner_id  = o.owner_id
     ORDER BY b.created_at DESC`,
  );
  return rows;
};

module.exports = {
  getAllOwners,
  updateOwnerStatus,
  findOwnerById,
  getAllTenants,
  getAllPGs,
  updatePGStatus,
  deletePGByAdmin,
  getAllBookings,
};

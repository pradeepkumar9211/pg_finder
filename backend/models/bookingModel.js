const db = require("../config/db");

const createBooking = async (data) => {
  const { booking_id, tenant_id, pg_id, booking_date } = data;
  await db.query(
    `INSERT INTO Booking (booking_id, tenant_id, pg_id, status, verification_status, booking_date)
     VALUES (?, ?, ?, 'pending', 'not_verified', ?)`,
    [booking_id, tenant_id, pg_id, booking_date],
  );
};

const findBookingById = async (booking_id) => {
  const [rows] = await db.query(
    `SELECT b.*, t.tenant_name, p.pg_name, p.owner_id
     FROM Booking b
     JOIN Tenant t ON b.tenant_id = t.tenant_id
     JOIN PG_room p ON b.pg_id = p.pg_id
     WHERE b.booking_id = ?`,
    [booking_id],
  );
  return rows[0];
};

const findBookingsByTenant = async (tenant_id) => {
  const [rows] = await db.query(
    `SELECT b.*, p.pg_name, p.city, p.rent
     FROM Booking b
     JOIN PG_room p ON b.pg_id = p.pg_id
     WHERE b.tenant_id = ?
     ORDER BY b.created_at DESC`,
    [tenant_id],
  );
  return rows;
};

const findBookingsByPG = async (pg_id) => {
  const [rows] = await db.query(
    `SELECT b.*, t.tenant_name, t.phone_no AS tenant_phone
     FROM Booking b
     JOIN Tenant t ON b.tenant_id = t.tenant_id
     WHERE b.pg_id = ?
     ORDER BY b.created_at DESC`,
    [pg_id],
  );
  return rows;
};

const updateVerificationStatus = async (booking_id) => {
  await db.query(
    `UPDATE Booking SET verification_status = 'verified' WHERE booking_id = ?`,
    [booking_id],
  );
};

const updateBookingStatus = async (booking_id, status) => {
  await db.query(`UPDATE Booking SET status = ? WHERE booking_id = ?`, [
    status,
    booking_id,
  ]);
};

const checkExistingBooking = async (tenant_id, pg_id) => {
  const [rows] = await db.query(
    `SELECT * FROM Booking
     WHERE tenant_id = ? AND pg_id = ? AND status IN ('pending', 'approved')`,
    [tenant_id, pg_id],
  );
  return rows[0];
};

module.exports = {
  createBooking,
  findBookingById,
  findBookingsByTenant,
  findBookingsByPG,
  updateVerificationStatus,
  updateBookingStatus,
  checkExistingBooking,
};

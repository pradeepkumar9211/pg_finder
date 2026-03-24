const db = require("../config/db");

const createFeedback = async (data) => {
  const { feed_id, tenant_id, pg_id, comment, rating } = data;
  await db.query(
    `INSERT INTO Feedback (feed_id, tenant_id, pg_id, comment, rating)
     VALUES (?, ?, ?, ?, ?)`,
    [feed_id, tenant_id, pg_id, comment, rating],
  );
};

const findFeedbackByPG = async (pg_id) => {
  const [rows] = await db.query(
    `SELECT f.*, t.tenant_name
     FROM Feedback f
     JOIN Tenant t ON f.tenant_id = t.tenant_id
     WHERE f.pg_id = ?
     ORDER BY f.created_at DESC`,
    [pg_id],
  );
  return rows;
};

const findFeedbackById = async (feed_id) => {
  const [rows] = await db.query(`SELECT * FROM Feedback WHERE feed_id = ?`, [
    feed_id,
  ]);
  return rows[0];
};

const deleteFeedback = async (feed_id) => {
  await db.query(`DELETE FROM Feedback WHERE feed_id = ?`, [feed_id]);
};

const checkApprovedBooking = async (tenant_id, pg_id) => {
  const [rows] = await db.query(
    `SELECT * FROM Booking
     WHERE tenant_id = ? AND pg_id = ? AND status = 'approved'`,
    [tenant_id, pg_id],
  );
  return rows[0];
};

const checkExistingFeedback = async (tenant_id, pg_id) => {
  const [rows] = await db.query(
    `SELECT * FROM Feedback WHERE tenant_id = ? AND pg_id = ?`,
    [tenant_id, pg_id],
  );
  return rows[0];
};

module.exports = {
  createFeedback,
  findFeedbackByPG,
  findFeedbackById,
  deleteFeedback,
  checkApprovedBooking,
  checkExistingFeedback,
};

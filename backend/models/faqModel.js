const db = require("../config/db");

const createFAQ = async (data) => {
  const { ques_id, owner_id, pg_id, tenant_id, question } = data;
  await db.query(
    `INSERT INTO FAQs (ques_id, owner_id, pg_id, tenant_id, question, answer)
     VALUES (?, ?, ?, ?, ?, '')`,
    [ques_id, owner_id, pg_id, tenant_id, question],
  );
};

const findFAQsByPG = async (pg_id) => {
  const [rows] = await db.query(
    `SELECT f.*, t.tenant_name
     FROM FAQs f
     JOIN Tenant t ON f.tenant_id = t.tenant_id
     WHERE f.pg_id = ?
     ORDER BY f.ques_id DESC`,
    [pg_id],
  );
  return rows;
};

const findFAQById = async (ques_id) => {
  const [rows] = await db.query(
    `SELECT f.*, p.owner_id
     FROM FAQs f
     JOIN PG_room p ON f.pg_id = p.pg_id
     WHERE f.ques_id = ?`,
    [ques_id],
  );
  return rows[0];
};

const answerFAQ = async (ques_id, answer) => {
  await db.query(`UPDATE FAQs SET answer = ? WHERE ques_id = ?`, [
    answer,
    ques_id,
  ]);
};

module.exports = { createFAQ, findFAQsByPG, findFAQById, answerFAQ };

const db = require("../config/db");

const createPG = async (data) => {
  const { pg_id, pg_name, room_type, owner_id, rent, address, pincode, city } =
    data;
  await db.query(
    `INSERT INTO PG_room (pg_id, pg_name, room_type, owner_id, rent, availability_status, address, pincode, city)
     VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)`,
    [pg_id, pg_name, room_type, owner_id, rent, address, pincode, city],
  );
};

const findPGById = async (pg_id) => {
  const [rows] = await db.query(
    `SELECT p.*, o.owner_name, o.phone_no AS owner_phone
     FROM PG_room p
     JOIN PG_owner o ON p.owner_id = o.owner_id
     WHERE p.pg_id = ?`,
    [pg_id],
  );
  return rows[0];
};

const findPGImages = async (pg_id) => {
  const [rows] = await db.query(`SELECT * FROM Room_images WHERE pg_id = ?`, [
    pg_id,
  ]);
  return rows;
};

const findPGsByOwner = async (owner_id) => {
  const [rows] = await db.query(`SELECT * FROM PG_room WHERE owner_id = ?`, [
    owner_id,
  ]);
  return rows;
};

const searchPGs = async (filters) => {
  const { city, pincode, room_type } = filters;

  let query = `SELECT p.*, o.owner_name FROM PG_room p
               JOIN PG_owner o ON p.owner_id = o.owner_id
               WHERE p.availability_status = 1`;
  const params = [];

  if (city) {
    query += ` AND p.city LIKE ?`;
    params.push(`%${city}%`);
  }
  if (pincode) {
    query += ` AND p.pincode = ?`;
    params.push(pincode);
  }
  if (room_type) {
    query += ` AND p.room_type = ?`;
    params.push(room_type);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const updatePG = async (pg_id, data) => {
  const {
    pg_name,
    room_type,
    rent,
    address,
    pincode,
    city,
    availability_status,
  } = data;
  await db.query(
    `UPDATE PG_room SET pg_name=?, room_type=?, rent=?, address=?, pincode=?, city=?, availability_status=?
     WHERE pg_id = ?`,
    [
      pg_name,
      room_type,
      rent,
      address,
      pincode,
      city,
      availability_status,
      pg_id,
    ],
  );
};

const deletePG = async (pg_id) => {
  await db.query(`DELETE FROM PG_room WHERE pg_id = ?`, [pg_id]);
};

const addImage = async (image_id, pg_id, image_url) => {
  await db.query(
    `INSERT INTO Room_images (image_id, pg_id, image_url) VALUES (?, ?, ?)`,
    [image_id, pg_id, image_url],
  );
};

const deleteImage = async (image_id) => {
  await db.query(`DELETE FROM Room_images WHERE image_id = ?`, [image_id]);
};

const findImageById = async (image_id) => {
  const [rows] = await db.query(
    `SELECT * FROM Room_images WHERE image_id = ?`,
    [image_id],
  );
  return rows[0];
};

module.exports = {
  createPG,
  findPGById,
  findPGImages,
  findPGsByOwner,
  searchPGs,
  updatePG,
  deletePG,
  addImage,
  deleteImage,
  findImageById,
};

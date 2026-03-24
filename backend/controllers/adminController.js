const {
  getAllOwners,
  updateOwnerStatus,
  findOwnerById,
  getAllTenants,
  getAllPGs,
  updatePGStatus,
  deletePGByAdmin,
  getAllBookings,
} = require("../models/adminModel");

const { findPGById } = require("../models/pgModel");

// GET /api/admin/owners
const getOwners = async (req, res, next) => {
  try {
    const owners = await getAllOwners();
    res.status(200).json({ success: true, count: owners.length, data: owners });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/owners/:owner_id/status
const updateOwner = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status must be approved or rejected.",
        });
    }

    const owner = await findOwnerById(req.params.owner_id);
    if (!owner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found." });
    }

    await updateOwnerStatus(req.params.owner_id, status);
    res
      .status(200)
      .json({ success: true, message: `Owner ${status} successfully.` });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/tenants
const getTenants = async (req, res, next) => {
  try {
    const tenants = await getAllTenants();
    res
      .status(200)
      .json({ success: true, count: tenants.length, data: tenants });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/pg
const getPGs = async (req, res, next) => {
  try {
    const pgs = await getAllPGs();
    res.status(200).json({ success: true, count: pgs.length, data: pgs });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/pg/:pg_id/status
const updatePG = async (req, res, next) => {
  try {
    const { availability_status } = req.body;

    if (availability_status === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "availability_status is required." });
    }

    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    await updatePGStatus(req.params.pg_id, availability_status);
    res
      .status(200)
      .json({ success: true, message: "PG status updated successfully." });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/pg/:pg_id
const deletePG = async (req, res, next) => {
  try {
    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    await deletePGByAdmin(req.params.pg_id);
    res
      .status(200)
      .json({ success: true, message: "PG removed successfully." });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/bookings
const getBookings = async (req, res, next) => {
  try {
    const bookings = await getAllBookings();
    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOwners,
  updateOwner,
  getTenants,
  getPGs,
  updatePG,
  deletePG,
  getBookings,
};

const {
  createBooking,
  findBookingById,
  findBookingsByTenant,
  findBookingsByPG,
  updateVerificationStatus,
  updateBookingStatus,
  checkExistingBooking,
} = require("../models/bookingModel");

const generateBookingId = () => `BKG${Date.now().toString().slice(-8)}`;

// POST /api/bookings
const sendBookingRequest = async (req, res, next) => {
  try {
    const { pg_id } = req.body;
    const tenant_id = req.user.id;

    if (!pg_id) {
      return res
        .status(400)
        .json({ success: false, message: "PG ID is required." });
    }

    // Prevent duplicate booking
    const existing = await checkExistingBooking(tenant_id, pg_id);
    if (existing) {
      return res
        .status(409)
        .json({
          success: false,
          message: "You already have an active booking for this PG.",
        });
    }

    const booking_id = generateBookingId();
    const booking_date = new Date().toISOString().split("T")[0];

    await createBooking({ booking_id, tenant_id, pg_id, booking_date });

    res
      .status(201)
      .json({
        success: true,
        message: "Booking request sent successfully.",
        booking_id,
      });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await findBookingsByTenant(req.user.id);
    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/pg/:pg_id
const getBookingsForPG = async (req, res, next) => {
  try {
    const bookings = await findBookingsByPG(req.params.pg_id);
    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:booking_id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await findBookingById(req.params.booking_id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Only the tenant or the pg owner can view this booking
    if (req.user.id !== booking.tenant_id && req.user.id !== booking.owner_id) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:booking_id/verify
const verifyTenant = async (req, res, next) => {
  try {
    const booking = await findBookingById(req.params.booking_id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Only the owner of that PG can verify
    if (req.user.id !== booking.owner_id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the PG owner can verify this tenant.",
        });
    }

    if (booking.verification_status === "verified") {
      return res
        .status(400)
        .json({ success: false, message: "Tenant is already verified." });
    }

    await updateVerificationStatus(req.params.booking_id);
    res
      .status(200)
      .json({ success: true, message: "Tenant verified successfully." });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookings/:booking_id/status
const updateStatus = async (req, res, next) => {
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

    const booking = await findBookingById(req.params.booking_id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });
    }

    // Only the owner of that PG can approve or reject
    if (req.user.id !== booking.owner_id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the PG owner can update this booking.",
        });
    }

    // Physical verification must be done before approving
    if (status === "approved" && booking.verification_status !== "verified") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Tenant must be physically verified before approving.",
        });
    }

    await updateBookingStatus(req.params.booking_id, status);
    res
      .status(200)
      .json({ success: true, message: `Booking ${status} successfully.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendBookingRequest,
  getMyBookings,
  getBookingsForPG,
  getBookingById,
  verifyTenant,
  updateStatus,
};

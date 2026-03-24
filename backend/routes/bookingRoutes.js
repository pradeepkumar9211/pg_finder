const { Router } = require("express");

const {
  sendBookingRequest,
  getMyBookings,
  getBookingsForPG,
  getBookingById,
  verifyTenant,
  updateStatus,
} = require("../controllers/bookingController");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const BookingRouter = Router();

BookingRouter.post(
  "/",
  verifyToken,
  authorizeRole("tenant"),
  sendBookingRequest,
);

BookingRouter.get("/my", verifyToken, authorizeRole("tenant"), getMyBookings);

BookingRouter.get(
  "/pg/:pg_id",
  verifyToken,
  authorizeRole("owner"),
  getBookingsForPG,
);

BookingRouter.get("/:booking_id", verifyToken, getBookingById);

BookingRouter.put(
  "/:booking_id/verify",
  verifyToken,
  authorizeRole("owner"),
  verifyTenant,
);

BookingRouter.put(
  "/:booking_id/status",
  verifyToken,
  authorizeRole("owner"),
  updateStatus,
);

module.exports = BookingRouter;

const { Router } = require("express");

const {
  getOwners,
  updateOwner,
  getTenants,
  getPGs,
  updatePG,
  deletePG,
  getBookings,
} = require("../controllers/adminController");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const AdminRouter = Router();

AdminRouter.get("/owners", verifyToken, authorizeRole("admin"), getOwners);
AdminRouter.put(
  "/owners/:owner_id/status",
  verifyToken,
  authorizeRole("admin"),
  updateOwner,
);
AdminRouter.get("/tenants", verifyToken, authorizeRole("admin"), getTenants);
AdminRouter.get("/pg", verifyToken, authorizeRole("admin"), getPGs);
AdminRouter.put(
  "/pg/:pg_id/status",
  verifyToken,
  authorizeRole("admin"),
  updatePG,
);
AdminRouter.delete("/pg/:pg_id", verifyToken, authorizeRole("admin"), deletePG);
AdminRouter.get("/bookings", verifyToken, authorizeRole("admin"), getBookings);

module.exports = AdminRouter;

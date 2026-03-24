const { Router } = require("express");

const {
  createPGListing,
  searchPGListings,
  getMyListings,
  getPGDetails,
  updatePGListing,
  deletePGListing,
  uploadImages,
  deleteImageFromPG,
} = require("../controllers/pgController");

const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const PGRouter = Router();

PGRouter.get("/search", searchPGListings);

PGRouter.get(
  "/owner/my-listings",
  verifyToken,
  authorizeRole("owner"),
  getMyListings,
);

PGRouter.get("/:pg_id", getPGDetails);

PGRouter.post("/", verifyToken, authorizeRole("owner"), createPGListing);

PGRouter.put("/:pg_id", verifyToken, authorizeRole("owner"), updatePGListing);

PGRouter.delete(
  "/:pg_id",
  verifyToken,
  authorizeRole("owner"),
  deletePGListing,
);

PGRouter.post(
  "/:pg_id/images",
  verifyToken,
  authorizeRole("owner"),
  upload.array("images", 5),
  uploadImages,
);

PGRouter.delete(
  "/:pg_id/images/:image_id",
  verifyToken,
  authorizeRole("owner"),
  deleteImageFromPG,
);

module.exports = PGRouter;

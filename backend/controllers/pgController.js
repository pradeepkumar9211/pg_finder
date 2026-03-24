const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const {
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
} = require("../models/pgModel");

const generatePgId = () => `PG${Date.now().toString().slice(-8)}`;
const generateImgId = () => `IMG${Date.now().toString().slice(-8)}`;

// POST /api/pg
const createPGListing = async (req, res, next) => {
  try {
    const { pg_name, room_type, rent, address, pincode, city } = req.body;

    if (!pg_name || !room_type || !rent || !address || !pincode || !city) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const pg_id = generatePgId();
    await createPG({
      pg_id,
      pg_name,
      room_type,
      rent,
      address,
      pincode,
      city,
      owner_id: req.user.id,
    });

    res
      .status(201)
      .json({ success: true, message: "PG listed successfully.", pg_id });
  } catch (err) {
    next(err);
  }
};

// GET /api/pg/search
const searchPGListings = async (req, res, next) => {
  try {
    const { city, pincode, room_type } = req.query;

    if (!city && !pincode) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Provide at least city or pincode to search.",
        });
    }

    const results = await searchPGs({ city, pincode, room_type });
    res
      .status(200)
      .json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

// GET /api/pg/owner/my-listings
const getMyListings = async (req, res, next) => {
  try {
    const listings = await findPGsByOwner(req.user.id);
    res
      .status(200)
      .json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    next(err);
  }
};

// GET /api/pg/:pg_id
const getPGDetails = async (req, res, next) => {
  try {
    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    const images = await findPGImages(req.params.pg_id);
    res.status(200).json({ success: true, data: { ...pg, images } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/pg/:pg_id
const updatePGListing = async (req, res, next) => {
  try {
    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    if (pg.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only update your own listings.",
        });
    }

    await updatePG(req.params.pg_id, req.body);
    res
      .status(200)
      .json({ success: true, message: "PG updated successfully." });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/pg/:pg_id
const deletePGListing = async (req, res, next) => {
  try {
    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    if (pg.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only delete your own listings.",
        });
    }

    await deletePG(req.params.pg_id);
    res
      .status(200)
      .json({ success: true, message: "PG deleted successfully." });
  } catch (err) {
    next(err);
  }
};

// POST /api/pg/:pg_id/images
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded." });
    }

    const pg = await findPGById(req.params.pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    if (pg.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only upload images for your own listings.",
        });
    }

    for (const file of req.files) {
      const image_id = generateImgId();
      const image_url = `uploads/pg_images/${file.filename}`;
      await addImage(image_id, req.params.pg_id, image_url);
    }

    res
      .status(201)
      .json({
        success: true,
        message: `${req.files.length} image(s) uploaded successfully.`,
      });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/pg/:pg_id/images/:image_id
const deleteImageFromPG = async (req, res, next) => {
  try {
    const image = await findImageById(req.params.image_id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found." });
    }

    // Delete physical file from disk
    const filePath = path.join(__dirname, "..", image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await deleteImage(req.params.image_id);
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPGListing,
  searchPGListings,
  getMyListings,
  getPGDetails,
  updatePGListing,
  deletePGListing,
  uploadImages,
  deleteImageFromPG,
};

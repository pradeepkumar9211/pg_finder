const {
  createFeedback,
  findFeedbackByPG,
  findFeedbackById,
  deleteFeedback,
  checkApprovedBooking,
  checkExistingFeedback,
} = require("../models/feedbackModel");

const generateFeedId = () => `FED${Date.now().toString().slice(-8)}`;

// POST /api/feedback
const submitFeedback = async (req, res, next) => {
  try {
    const { pg_id, comment, rating } = req.body;
    const tenant_id = req.user.id;

    if (!pg_id || !comment || !rating) {
      return res
        .status(400)
        .json({
          success: false,
          message: "PG ID, comment and rating are required.",
        });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    // Only tenants with an approved booking can give feedback
    const approvedBooking = await checkApprovedBooking(tenant_id, pg_id);
    if (!approvedBooking) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only give feedback after an approved booking.",
        });
    }

    // One feedback per tenant per PG
    const alreadyReviewed = await checkExistingFeedback(tenant_id, pg_id);
    if (alreadyReviewed) {
      return res
        .status(409)
        .json({
          success: false,
          message: "You have already submitted feedback for this PG.",
        });
    }

    const feed_id = generateFeedId();
    await createFeedback({ feed_id, tenant_id, pg_id, comment, rating });

    res
      .status(201)
      .json({
        success: true,
        message: "Feedback submitted successfully.",
        feed_id,
      });
  } catch (err) {
    next(err);
  }
};

// GET /api/feedback/pg/:pg_id
const getFeedbackForPG = async (req, res, next) => {
  try {
    const feedback = await findFeedbackByPG(req.params.pg_id);
    res
      .status(200)
      .json({ success: true, count: feedback.length, data: feedback });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/feedback/:feed_id
const removeFeedback = async (req, res, next) => {
  try {
    const feedback = await findFeedbackById(req.params.feed_id);
    if (!feedback) {
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found." });
    }

    await deleteFeedback(req.params.feed_id);
    res
      .status(200)
      .json({ success: true, message: "Feedback removed successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFeedback, getFeedbackForPG, removeFeedback };

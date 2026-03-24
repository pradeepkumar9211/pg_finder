const { Router } = require("express");

const {
  submitFeedback,
  getFeedbackForPG,
  removeFeedback,
} = require("../controllers/feedbackController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const FeedbackRouter = Router();

FeedbackRouter.post("/", verifyToken, authorizeRole("tenant"), submitFeedback);
FeedbackRouter.get("/pg/:pg_id", getFeedbackForPG);
FeedbackRouter.delete(
  "/:feed_id",
  verifyToken,
  authorizeRole("admin"),
  removeFeedback,
);

module.exports = FeedbackRouter;

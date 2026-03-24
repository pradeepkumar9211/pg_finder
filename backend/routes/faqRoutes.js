const { Router } = require("express");

const {
  askQuestion,
  getFAQsForPG,
  answerQuestion,
} = require("../controllers/faqController");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");

const FAQRouter = Router();

FAQRouter.post("/", verifyToken, authorizeRole("tenant"), askQuestion);
FAQRouter.get("/pg/:pg_id", getFAQsForPG);
FAQRouter.put(
  "/:ques_id/answer",
  verifyToken,
  authorizeRole("owner"),
  answerQuestion,
);

module.exports = FAQRouter;

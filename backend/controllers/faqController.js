const {
  createFAQ,
  findFAQsByPG,
  findFAQById,
  answerFAQ,
} = require("../models/faqModel");
const { findPGById } = require("../models/pgModel");

const generateQuesId = () => `QUE${Date.now().toString().slice(-8)}`;

// POST /api/faqs
const askQuestion = async (req, res, next) => {
  try {
    const { pg_id, question } = req.body;
    const tenant_id = req.user.id;

    if (!pg_id || !question) {
      return res
        .status(400)
        .json({ success: false, message: "PG ID and question are required." });
    }

    const pg = await findPGById(pg_id);
    if (!pg) {
      return res.status(404).json({ success: false, message: "PG not found." });
    }

    const ques_id = generateQuesId();

    await createFAQ({
      ques_id,
      owner_id: pg.owner_id,
      pg_id,
      tenant_id,
      question,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Question submitted successfully.",
        ques_id,
      });
  } catch (err) {
    next(err);
  }
};

// GET /api/faqs/pg/:pg_id
const getFAQsForPG = async (req, res, next) => {
  try {
    const faqs = await findFAQsByPG(req.params.pg_id);
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    next(err);
  }
};

// PUT /api/faqs/:ques_id/answer
const answerQuestion = async (req, res, next) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res
        .status(400)
        .json({ success: false, message: "Answer is required." });
    }

    const faq = await findFAQById(req.params.ques_id);
    if (!faq) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found." });
    }

    // Only the owner of that PG can answer
    if (req.user.id !== faq.owner_id) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only the PG owner can answer this question.",
        });
    }

    await answerFAQ(req.params.ques_id, answer);
    res
      .status(200)
      .json({ success: true, message: "Answer submitted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = { askQuestion, getFAQsForPG, answerQuestion };

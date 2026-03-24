const { Router } = require("express");

const { register, login, getMe } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const AuthRouter = Router();

AuthRouter.post("/register", register);

AuthRouter.post("/login", login);

AuthRouter.get("/me", verifyToken, getMe);

module.exports = AuthRouter;

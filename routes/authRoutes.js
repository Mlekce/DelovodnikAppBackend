const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5,
  message: "Previše pokušaja logovanja. Probajte kasnije.",
});

router.post("/api/register", controller.register);
router.post("/api/login", loginLimiter, controller.login);
router.get("/api/me", authMiddleware, controller.me);
router.post("/api/reset", controller.resetPassword);
router.get("/api/verify/:token", controller.verifikujNalog)
module.exports = router;

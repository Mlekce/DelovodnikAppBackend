const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/api/register", controller.register);
router.post("/api/login", controller.login);
router.get("/api/me", authMiddleware, controller.me);
router.post("/api/reset", controller.resetPassword);
router.get("/api/verify/:token", controller.verifikujNalog)
module.exports = router;

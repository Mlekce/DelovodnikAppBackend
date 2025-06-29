const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/api/register", controller.register);
router.post("/api/login", controller.login);
router.get("/api/me", controller.me);

module.exports = router;

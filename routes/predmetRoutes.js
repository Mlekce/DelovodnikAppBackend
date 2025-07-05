const express = require("express");
const router = express.Router();
const controller = require("../controllers/predmetController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/api/predmet", authMiddleware, controller.sviPredmeti);
router.post("/api/predmet", authMiddleware, controller.kreirajPredmet);
//router.get("/api/predmet/stats", authMiddleware, controller.statistika);

module.exports = router;
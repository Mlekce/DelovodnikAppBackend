const express = require("express");
const router = express.Router();
const controller = require("../controllers/predmetController");

router.get("/api/predmet", controller.sviPredmeti);
router.post("/api/predmet", controller.kreirajPredmet);
router.get("/api/predmet/stats", controller.statistika);

module.exports = router;
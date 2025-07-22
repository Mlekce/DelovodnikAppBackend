const express = require("express");
const router = express.Router();
const controller = require("../controllers/predmetController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/api/predmet", authMiddleware, controller.sviPredmeti);
router.post("/api/predmet", authMiddleware, controller.kreirajPredmet);
router.get("/api/predmet/stats", authMiddleware, controller.statistikaPredmeta);
router.post("/api/predmet/pretraga", authMiddleware, controller.posebnaPretraga)
router.delete("/api/predmet/del", authMiddleware, controller.obrisiPredmet);
module.exports = router;
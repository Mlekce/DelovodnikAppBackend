const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const verifikujToken = require("../middleware/authMiddleware");
const verifikujAdministratora = require("../middleware/adminMiddleware");

router.get(
  "/api/users",
  verifikujToken,
  verifikujAdministratora,
  controller.listaKorisnika
);
router.get("/api/users/:id", verifikujToken, controller.detaljiKorisnik);
router.put("/api/users/:id", verifikujToken, controller.izmeniPodatke);
router.post("/api/users/avatar", verifikujToken, controller.avatar);
router.put("/api/users/password", verifikujToken, controller.promeniLozinku);

module.exports = router;

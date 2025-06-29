const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/api/users", controller.listaKorisnika);
router.get("/api/users/:id", controller.detaljiKorisnik);
router.put("/api/users/:id", controller.izmeniPodatke);
router.post("/api/users/avatar", controller.avatar);
router.put("/api/users/password", controller.promeniLozinku);

module.exports = router;
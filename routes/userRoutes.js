const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const verifikujToken = require("../middleware/authMiddleware");
const verifikujAdministratora = require("../middleware/adminMiddleware");
const upload = require("../middleware/multerMiddleware");
router.get(
  "/api/users",
  verifikujToken,
  verifikujAdministratora,
  controller.listaKorisnika
);
router.get("/api/users/:id", verifikujToken, controller.detaljiKorisnik);
/*router.put("/api/users/podaci/:id", verifikujToken, controller.izmeniPodatke);*/
router.put("/api/users/reset/:id", verifikujToken, verifikujAdministratora, controller.resetLozinke);
router.post("/api/users/avatar", verifikujToken, upload, controller.avatar);
router.put("/api/users/password", verifikujToken, controller.promeniLozinku);
router.put("/api/users/sluzba", verifikujToken, controller.izmeniSluzbu);
module.exports = router;

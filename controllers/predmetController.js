const { AppError } = require("../models/AppError");
const Predmet = require("../models/Predmet");

async function sviPredmeti(req, res) {
  try {
    const korisnikId = req.user?.id;

    if (!korisnikId) {
      return res
        .status(401)
        .json({ poruka: "Nedostaje autorizacija korisnika." });
    }

    const predmeti = await Predmet.sviPredmetiKorisnika(korisnikId);

    if (!predmeti || predmeti.length === 0) {
      return res.status(404).json({ poruka: "Korisnik nema unetih predmeta." });
    }

    return res.status(200).json(predmeti);
  } catch (error) {
    console.error("Greška u sviPredmeti:", error);
    return res.status(500).json({ poruka: "Greška na serveru." });
  }
}

module.exports = {
  sviPredmeti,
};

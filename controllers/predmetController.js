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

async function kreirajPredmet(req, res) {
  try {
    const {
      broj_predmeta,
      stranka,
      referent,
      datum_podnosenja,
      datum_pravosnaznosti,
      napomena,
      status,
    } = req.body;

    const korisnik_id = req.user.id;

    if (!korisnik_id || !broj_predmeta || !stranka || !datum_podnosenja) {
      return res.status(400).json({ poruka: "Nedostaju obavezna polja." });
    }

    const predmet = new Predmet(
      broj_predmeta,
      stranka,
      referent,
      datum_podnosenja,
      datum_pravosnaznosti,
      napomena,
      status,
      korisnik_id
    );

    const predmetId = await predmet.dodajPredmet();

    return res
      .status(201)
      .json({ poruka: "Predmet uspešno dodat.", id: predmetId });
  } catch (error) {
    throw new AppError("Greska u kreirajPredmet funkciji", 500);
  }
}

module.exports = {
  sviPredmeti,
  kreirajPredmet,
};

const AppError = require("../models/AppError");
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

async function posebnaPretraga(req, res){
  try {
    const args = Object.entries(req.body.predmet);  // <-- ključno
    let args2 = args.filter(([polje, vrednost]) => vrednost !== undefined && vrednost !== null && vrednost !== "");
    let podaci = await Predmet.posebnaPretraga(...args2);
    console.log(args, args2, podaci)
    if (podaci) {
      return res.status(200).json(podaci);
    }

    return res.status(400).json({ poruka: 'Greska na serveru!' });
  } catch (error) {
    console.error("Greška u posebnaPretraga:", error);
    return res.status(500).json({ poruka: "Greška na serveru." });
  }
}

async function kreirajPredmet(req, res) {
  console.log(req.body.predmet)
  try {
    const {
      broj_predmeta,
      stranka,
      referent,
      datum_podnosenja,
      datum_pravosnaznosti,
      napomena,
      status,
    } = req.body.predmet;

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
    console.error(error.message)
    throw new AppError("Greska u kreirajPredmet funkciji", 500);
  }
}

async function statistikaPredmeta(req, res){
  let id = req.query.id;
  try {
    let godina = await Predmet.statistikaGodina(id);
    let mesec = await Predmet.statistikaMesec(id);
    let dan = await Predmet.statistikaDan(id);
    let nedelja = await Predmet.statistikaNedelja(id);
    let sedamDana = await Predmet.statistikaNedeljaPoDanima(id);
    let sestMeseci = await Predmet.statistikaPojedinacniMesec(id);
    return res
    .status(200)
    .json({
      poruka: "Uspeh",
      dan,
      nedelja,
      mesec,
      godina,
      sedamDana,
      sestMeseci
    });
  } catch (error) {
    console.error(error.message)
    throw new AppError("Greska u statistikaPredmeta funkciji", 500);
  }
  
}

async function obrisiPredmet(req, res) {
  try {
     let id = req.body.id;
    if(!id){
      return res.status(400).json({poruka: "Parametar id nije setovan."})
    }
    let rezultat = await Predmet.izbrisiPredmet(id);
    rezultat ? res.status(200).json({poruka: "Uspesno izbrisan predmet"}) :
    res.status(400).json({poruka: "Predmet nije izbrisan!"})
    return
  } catch (error) {
    console.error(error.message)
    throw new AppError("Greska u obrisiPredmet funkciji", 500);
  }
}

module.exports = {
  sviPredmeti,
  kreirajPredmet,
  posebnaPretraga,
  statistikaPredmeta,
  obrisiPredmet
};

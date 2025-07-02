const path = require("path");
const  AppError  = require("../models/AppError");
const User = require(path.join(__dirname, "..", "models", "User.js"));

async function avatar(req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ poruka: "Fajl nije zakacen ili format avatara nije podrzan!" });
    }
    const korisnikId = req.user.id;
    const imeFajla = req.file.filename;

    await User.dodajAvatar(korisnikId, imeFajla);

    return res.status(201).json({ poruka: "Vas fajl je uspesno sacuvan!" });
  } catch (error) {
    console.log(error);
    throw new AppError("Greska u avatr funkciji!", 500);
  }
}

async function detaljiKorisnik(req, res) {
  try {
    const korId = req.params["id"];
    let podaci = await User.povuciPodatke(korId);
    if (!podaci) {
      return res
        .status(400)
        .json({ poruka: "Ne postoji korisnik sa ovim parametrima!" });
    }
    return res.status(200).json(podaci);
  } catch (error) {
    throw new AppError("Greska u kontroleru, u funkciji detaljiKorisnik", 500);
  }
}

async function promeniLozinku(req, res) {
  try {
    let staraLozinka = req.body.staraLozinka;
    let novaLozinka = req.body.novaLozinka;
    let id = req.user.id;
    let rezultat = await User.zameniLozinku(id, staraLozinka, novaLozinka);
    rezultat
      ? res.status(201).json({ poruka: "Uspesno zamenjena lozinka!" })
      : res
          .status(400)
          .json({ poruka: "Doslo je do greske pri zameni lozinke!" });
    return;
  } catch (error) {
    throw new AppError("Greska u funkciji promeniLozinku" + error.message, 500);
  }
}

async function izmeniPodatke(req, res) {
  try {
    const { ime, uloga, sluzba } = req.body;
    const korId = req.user?.id;

    if (korId && ime && uloga && sluzba) {
      const uspesno = await User.izmenaPodatakaKorisnika(
        korId,
        ime,
        uloga,
        sluzba
      );

      if (uspesno) {
        return res.status(201).json({ poruka: "Izmene uspešno snimljene." });
      } else {
        return res
          .status(500)
          .json({ poruka: "Došlo je do greške prilikom izmene." });
      }
    }

    return res.status(409).json({ poruka: "Prazan ili neispravan zahtev." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ poruka: "Greška na serveru." });
  }
}

async function listaKorisnika(req, res){
  try {
    let {sviKorisnici, brojKorisnika} = await User.PrikaziSveKorisnike();
    return res.status(200).json({poruka : { sviKorisnici, brojKorisnika}})
  } catch (error) {
    console.error(error);
    throw new AppError("Greska u funkciji listaKorisnika", 500);
  }
}

module.exports = {
  avatar,
  detaljiKorisnik,
  promeniLozinku,
  izmeniPodatke,
  listaKorisnika
};

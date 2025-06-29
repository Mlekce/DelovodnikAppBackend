const User = require("../models/User");

async function register(req, res) {
  try {
    const { ime, email, lozinka, uloga, sluzba, avatar } = req.body;
    let proveraLozinke = await User.validirajLozinku(lozinka);
    if (!proveraLozinke) {
      res.status(400).json({
        poruka: "Lozinka je suvise kratka ili ne ispnjava kompleksnost.",
      });
      return;
    }

    const enkriptovanaLozinka = await User.hashLozinke(lozinka);
    let korisnik = new User(
      ime,
      email,
      enkriptovanaLozinka,
      uloga,
      sluzba,
      avatar
    );

    !(await korisnik.signup())
      ? res.status(409).json({ poruka: "Korisnicki nalog vec postoji u bazi" })
      : res.status(201).json({ poruka: "Uspesno kreiran korisnik!" });
    return;

  } catch (error) {
    console.error(error);
    return res.status(500).json({ poruka: "Greška na serveru." });
  }
}

async function login(req, res) {
  try {
    const { email, lozinka } = req.body;
    if (!email || !lozinka) {
      return res.status(400).json({ poruka: "Email i lozinka su obavezni." });
    }
    
    const rezultat = await User.login(email, lozinka);
    if (!rezultat) {
      return res
        .status(401)
        .json({ poruka: "Korisničko ime ili lozinka nisu ispravni." });
    }
    return res.status(200).json(rezultat);
  } catch (error) {
    console.error("Greška u login kontroleru:", error.message);
    return res.status(500).json({ poruka: "Došlo je do greške na serveru." });
  }
}

function me(req, res) {
  return;
}

module.exports = {
  register,
  login,
  me,
};

const User = require("../models/User");
const uuid4 = require("uuid4");
const {Resend} = require("resend");
const AppError = require("../models/AppError");
require("dotenv").config();


async function register(req, res) {
  try {
    const { ime, email, lozinka, uloga, sluzba, avatar } = req.body;
    let proveraLozinke = await User.validirajLozinku(lozinka);
    if (!proveraLozinke) {
      return res.status(400).json({
        poruka: "Lozinka je suvise kratka ili ne ispnjava kompleksnost.",
      });
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

async function me(req, res) {
  try {
    const { id, email, uloga } = req.user;
    let rezultat = await User.povuciPodatke(id);  
    if (rezultat.length === 0) {
      return res.status(404).json({ poruka: "Korisnik nije pronađen." });
    }
    return res.status(200).json(rezultat);
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ poruka: "Greška prilikom učitavanja korisnika." });
  }
}

async function resetPassword(req, res){
  try {
    const email = req.body.email;

    const emailProvera = await User.proveraEmailAdrese(email);
    if(!emailProvera){
      return res.status(400).json({ poruka: "Email adresa ne postoji" });
    }

    const novaLozinka = uuid4().slice(0, 10); 

    await User.resetPass(email, novaLozinka);
    await posaljiMejl(email, novaLozinka);

    return res.status(200).json({ poruka: "Nova lozinka je poslata na e-mail." });

  } catch (error) {
    console.error("Greška u resetPassword:", error.message);
    throw new AppError("Greška u funkciji resetPassword: " + error.message, 500);
  }
}

async function posaljiMejl(email, novaLozinka) {
  const resend = new Resend(process.env.ResendApiKey);
  const { data, error } = await resend.emails.send({
    from: "noreply@coded.in.rs",
    to: `${email}`,
    subject: 'Reset password',
    html: `<strong>Vasa nova lozinka je:</strong><p>${novaLozinka}</p>`
  });
  
  if(error){
    console.log(error)
    throw new AppError("Greska prilikom slanja email-a" + error.message, 500)
  }

  return true
}

module.exports = {
  register,
  login,
  me,
  resetPassword
};

const path = require("path");
const { AppError } = require("../models/AppError");
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

module.exports = {
  avatar,
};

const getPool = require("../data/konektor");
const AppError = require("./AppError");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class User {
  constructor(ime, email, lozinka, uloga, sluzba, avatar) {
    this.ime = ime;
    this.email = email;
    this.lozinka = lozinka;
    this.uloga = uloga;
    this.sluzba = sluzba;
    this.avatar = avatar || null;
  }

  async proveraNaloga() {
    const pool = await getPool();
    try {
      const upit = "SELECT email FROM users WHERE email = (?)";
      let rezultat = await pool.query(upit, [this.email]);
      if (rezultat[0].length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new AppError(
        "Greska prilikom provere naloga u funkciji proveraNaloga",
        500
      );
    }
  }

  async signup() {
    try {
      if (!(await this.proveraNaloga())) {
        const pool = await getPool();
        let upit =
          "INSERT INTO users (ime, email, lozinka, uloga, sluzba, avatar) VALUES (?,?,?,?,?,?)";
        let rezultat = await pool.query(upit, [
          this.ime,
          this.email,
          this.lozinka,
          this.uloga,
          this.sluzba,
          this.avatar,
        ]);

        return rezultat[0].affectedRows === 1;
      }
      return false;
    } catch (error) {
      throw new AppError(`Greska u signup funkciji ${error.message}`, 500);
    }
  }

  static async validirajLozinku(password) {
    const passwd = validator.trim(password);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regex.test(passwd)) {
      return false;
    }
    return true;
  }

  static async hashLozinke(lozinka) {
    const saltRounds = 10;
    return await bcrypt.hash(lozinka, saltRounds);
  }

  static async proveriLozinku(unetaLozinka, hesovanaLozinka) {
    return await bcrypt.compare(unetaLozinka, hesovanaLozinka);
  }

  static generisiToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
  }

  static async login(email, lozinka) {
    const pool = await getPool();
    try {
      const upit = "SELECT * FROM users WHERE email = ?";
      const [rezultat] = await pool.query(upit, [email]);
      if (rezultat.length === 0) {
        return false;
      }
      const korisnik = rezultat[0];
      const lozinkaOk = await User.proveriLozinku(lozinka, korisnik.lozinka);
      if (!lozinkaOk) {
        return false;
      }
      const payload = {
        id: korisnik.id,
        email: korisnik.email,
        uloga: korisnik.uloga,
      };
      const token = User.generisiToken(payload);
      return {
        token,
        korisnik: {
          id: korisnik.id,
          ime: korisnik.ime,
          email: korisnik.email,
          uloga: korisnik.uloga,
          sluzba: korisnik.sluzba,
          avatar: korisnik.avatar,
          datum_registracije: korisnik.datum_registracije,
        },
      };
    } catch (error) {
      throw new AppError(`Greška u login funkciji: ${error.message}`, 500);
    }
  }

  static async povuciPodatke(idKor) {
    try {
      const pool = await getPool();
      let upit =
        "SELECT id, ime, email, uloga, sluzba, avatar, datum_registracije FROM users WHERE id = ?";
      let [rezultat] = await pool.query(upit, [idKor]);
      if (rezultat.length == 0) {
        return false;
      }
      return rezultat[0];
    } catch (error) {
      throw new AppError(
        `Greška u povuciPodatke funkciji: ${error.message}`,
        500
      );
    }
  }

  static async PrikaziSveKorisnike() {
    try {
      const pool = await getPool();
      const upit = "SELECT * FROM users";
      const [rezultat] = await pool.query(upit);
      return {
        sviKorisnici: rezultat,
        brojKorisnika: rezultat.length,
      };
    } catch (error) {
      throw new AppError("Greska u funkciji PrikaziSveKorisnike", 500);
    }
  }

  static async dodajAvatar(korId, imeFajla) {
    try {
      let pool = await getPool();
      let upit = "UPDATE users SET avatar = ? WHERE id=(?)";
      await pool.query(upit, [imeFajla, korId]);
      let rezultat = await User.povuciPodatke(korId);
      if (!rezultat) {
        return false;
      }
      return rezultat;
    } catch (error) {
      throw new AppError("Greška u postaviAvatar: " + error.message, 500);
    }
  }

  static async izmeniSluzbu(korId, sluzba) {
    try {
      const pool = await getPool();
      const upit = "UPDATE users SET sluzba = ? WHERE id=(?)";
      await pool.query(upit, [sluzba, korId]);
      let rezultat = await User.povuciPodatke(korId);
      if (!rezultat) {
        return false;
      }
      return rezultat;
    } catch (error) {
      throw new AppError("Greška u izmeniSluzbu: " + error.message, 500);
    }
  }

  static async zameniLozinku(korId, staraLozinka, novaLozinka) {
    try {
      let pool = await getPool();
      let upit = "SELECT lozinka FROM users WHERE id = ?";
      let [rezultat] = await pool.query(upit, [korId]);
      if (rezultat.length == 0) {
        return false;
      }
      const lozinkaOk = await User.proveriLozinku(
        staraLozinka,
        rezultat[0].lozinka
      );
      if (!lozinkaOk) {
        return false;
      }
      let encLozinka = await User.hashLozinke(novaLozinka);
      upit = "UPDATE users SET lozinka = ? WHERE id=(?)";
      await pool.query(upit, [encLozinka, korId]);
      return true;
    } catch (error) {
      throw new AppError(
        "Greska u funkciji zameniLozinku" + error.message,
        500
      );
    }
  }

  static async resetujLozinku(korId, novaLozinka) {
    try {
      let pool = await getPool();
      let upit = "SELECT lozinka FROM users WHERE id = ?";
      let [rezultat] = await pool.query(upit, [korId]);
      if (rezultat.length == 0) {
        return false;
      }

      let testLozinke = await User.validirajLozinku(novaLozinka);
      if (!testLozinke) {
        return false;
      }

      let encLozinka = await User.hashLozinke(novaLozinka);
      upit = "UPDATE users SET lozinka = ? WHERE id=(?)";
      await pool.query(upit, [encLozinka, korId]);
      return true;
    } catch (error) {
      throw new AppError(
        "Greska u funkciji zameniLozinku" + error.message,
        500
      );
    }
  }

  static async izmenaPodatakaKorisnika(id, ime, uloga, sluzba) {
    const pool = await getPool();
    const upit = "UPDATE users SET ime = ?, uloga = ?, sluzba = ? WHERE id = ?";
    const [rezultat] = await pool.query(upit, [ime, uloga, sluzba, id]);
    return rezultat.affectedRows === 1;
  }

  static async izbrisiKorisnika(id){
    try {
      const pool = await getPool();
      const upit = "DELETE FROM users WHERE id=?"
      const [rezultat] = await pool.query(upit, [id]);
      return rezultat.affectedRows === 1;      
    } catch (error) {
      throw new AppError(
        "Greska u funkciji izbrisiKorisnika" + error.message,
        500
      );
    }
  }
}

module.exports = User;

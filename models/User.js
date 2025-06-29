const getPool = require("../data/konektor");
const AppError = require("./AppError");

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

        if (rezultat[0].affectedRows === 1) {
          return true;
        }
        return false;
      }
    } catch (error) {
      throw new AppError(`Greska u signup funkciji ${error.message}`, 500);
    }
  }

  static async validirajLozinku(password) {
    const passwd = validator.escape(password.trim());
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regex.test(passwd)) {
      return false;
    }
    return passwd;
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

  async login() {
    const pool = await getPool();
    try {
      const upit = "SELECT * FROM users WHERE email = ?";
      const [rezultat] = await pool.query(upit, [this.email]);
      if (rezultat.length === 0) {
        return false;
      }
      const korisnik = rezultat[0];
      const lozinkaOk = await User.proveriLozinku(
        this.lozinka,
        korisnik.lozinka
      );
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
        },
      };
    } catch (error) {
      throw new AppError(`Greška u login funkciji: ${error.message}`,500);
    }
  }
}

module.exports = User;

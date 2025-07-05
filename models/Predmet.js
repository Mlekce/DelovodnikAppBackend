const getPool = require("../data/konektor");
const AppError = require("./AppError");

class Predmet {
  constructor(
    broj_predmeta,
    stranka,
    referent,
    datum_podnosenja,
    datum_pravosnaznosti,
    napomena,
    status,
    korisnik_id
  ) {
    this.broj_predmeta = broj_predmeta;
    this.stranka = stranka;
    this.referent = referent;
    this.datum_podnosenja = datum_podnosenja;
    this.datum_pravosnaznosti = datum_pravosnaznosti;
    this.napomena = napomena || null;
    this.status = status || "u_izradi";
    this.korisnik_id = korisnik_id;
  }

  async dodajPredmet() {
    try {
      let pool = await getPool();
      let upit = "INSERT INTO predmeti (broj_predmeta, ime_stranke, referent, datum_podnosenja, datum_pravosnaznosti, napomena, status, korisnik_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      let [rezultat] = await pool.query(upit, [
        this.broj_predmeta,
        this.stranka,
        this.referent,
        this.datum_podnosenja,
        this.datum_pravosnaznosti,
        this.napomena,
        this.status,
        this.korisnik_id,
      ]);
      return rezultat.insertId;
    } catch (error) {
      throw new AppError("Greska u funkciji dodajPredmet!", 500);
    }
  }

  static async sviPredmetiKorisnika(korisnikId) {
    const pool = await getPool();
    const upit = "SELECT * FROM predmeti WHERE korisnik_id = ? ORDER BY datum_unosa DESC";
    const [rezultat] = await pool.query(upit, [korisnikId]);
    return rezultat;
  }

  static async izmeniStatus(id, noviStatus, korisnikId) {
    const pool = await getPool();
    const upit =
      "UPDATE predmeti SET status = ? WHERE id = ? AND korisnik_id = ?";
    const [rezultat] = await pool.query(upit, [noviStatus, id, korisnikId]);
    return rezultat.affectedRows === 1;
  }

  static async izbrisi(id, korisnikId) {
    const pool = await getPool();
    const upit = "DELETE FROM predmeti WHERE id = ? AND korisnik_id = ?";
    const [rezultat] = await pool.query(upit, [id, korisnikId]);
    return rezultat.affectedRows === 1;
  }
}

module.exports = Predmet;

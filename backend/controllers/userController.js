const db = require("../config/db");

// LOGIN (dummy, ako nemaš još logiku)
exports.login = (req, res) => {
  res.status(501).json({ error: "Nije implementirano" });
};

// REGISTER (dummy, ako nemaš još logiku)
exports.register = (req, res) => {
  res.status(501).json({ error: "Nije implementirano" });
};

// PATCH /api/users/:id – izmjena profila
exports.updateProfile = (req, res) => {
  const { ime, prezime, opis, profilna_url } = req.body;
  const id = req.params.id;

  db.query(
    "UPDATE korisnik SET ime=?, prezime=?, opis=?, profilna_url=? WHERE id=?",
    [ime, prezime, opis, profilna_url, id],
    (err) => {
      if (err) return res.status(500).json({ error: "Greška pri izmjeni" });
      res.json({ message: "Profil ažuriran" });
    }
  );
};

// Ostavi i getOne i getAll kao što imaš
exports.getOne = (req, res) => {
  db.query(
    "SELECT id, ime, prezime, email, opis, profilna_url, role FROM korisnik WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška u bazi" });
      if (result.length === 0) return res.status(404).json({ error: "Korisnik ne postoji" });
      res.json(result[0]);
    }
  );
};

exports.getAll = (req, res) => {
  db.query(
    "SELECT id, ime, prezime, email, opis, profilna_url, role FROM korisnik",
    [],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška u bazi" });
      res.json(result);
    }
  );
};

exports.getUserReviews = (req, res) => {
  db.query(
    `SELECT o.ocjena, o.komentar, o.datum, i.id AS igra_id, i.naziv, i.slika_url, i.zanr
     FROM ocjena o
     JOIN igra i ON o.igra_id = i.id
     WHERE o.korisnik_id = ?
     ORDER BY o.datum DESC`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška u bazi" });
      res.json(result);
    }
  );
};

exports.searchUsers = (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]);
  
  db.query(
    "SELECT id, ime, prezime, email FROM korisnik WHERE ime LIKE ? OR prezime LIKE ? OR email LIKE ?",
    [`%${q}%`, `%${q}%`, `%${q}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Greška u bazi" });
      res.json(results);
    }
  );
};

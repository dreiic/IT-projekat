const express = require("express");
const router = express.Router();
const db = require("../config/db");

// === GET sve igre ===
router.get("/", (req, res) => {
  db.query("SELECT * FROM igra", (err, result) => {
    if (err) return res.status(500).json({ error: "Greška" });
    res.json(result);
  });
});

// === POST dodaj novu igru ===
router.post("/", (req, res) => {
  const { naziv, zanr, kupi_url, slika_url } = req.body;
  db.query(
    "INSERT INTO igra (naziv, zanr, slika_url, kupi_url) VALUES (?, ?, ?, ?)",
    [naziv, zanr, slika_url, kupi_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Ne mogu dodati" });
      // Možeš vratiti novi ID ako trebaš na frontendu
      res.status(201).json({ id: result.insertId, message: "Igra dodata" });
    }
  );
});

// === DELETE igra po ID ===
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM igra WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Ne mogu obrisati" });
    res.json({ message: "Igra obrisana" });
  });
});

// === POST ocijeni igru ===
router.post("/:id/rate", (req, res) => {
  const { userId, rating, comment } = req.body;
  db.query(
    "INSERT INTO ocjena (igra_id, korisnik_id, ocjena, komentar) VALUES (?, ?, ?, ?)",
    [req.params.id, userId, rating, comment],
    (err) => {
      if (err) return res.status(500).json({ error: "Upis nije uspio" });
      res.status(201).json({ message: "Ocjena dodata" });
    }
  );
});

// === GET sve ocjene za igru ===
router.get("/:id/ratings", (req, res) => {
  db.query(
    `SELECT k.ime AS korisnik, o.ocjena, o.komentar, o.datum
     FROM ocjena o
     JOIN korisnik k ON o.korisnik_id = k.id
     WHERE o.igra_id = ?
     ORDER BY o.datum DESC`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Ne mogu dobiti ocjene" });
      res.json(result);
    }
  );
});

router.get("/genres", (req, res) => {
  const sql = "SELECT DISTINCT zanr FROM igra ORDER BY zanr";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Greška u bazi" });
    // results je niz objekata sa poljem zanr
    const genres = results.map(row => row.zanr);
    res.json(genres);
  });
});


module.exports = router;

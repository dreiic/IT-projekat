const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");

router.get("/genres", (req, res) => {
  db.query("SELECT DISTINCT zanr FROM igra ORDER BY zanr", (err, results) => {
    if (err) return res.status(500).json({ error: "Greška u bazi" });
    res.json(results.map(row => row.zanr));
  });
});

router.get("/", (req, res) => {
  db.query("SELECT * FROM igra", (err, result) => {
    if (err) return res.status(500).json({ error: "Greška" });
    res.json(result);
  });
});

router.post("/", auth, adminOnly, (req, res) => {
  const { naziv, zanr, kupi_url, slika_url } = req.body;
  db.query(
    "INSERT INTO igra (naziv, zanr, slika_url, kupi_url) VALUES (?, ?, ?, ?)",
    [naziv, zanr, slika_url, kupi_url],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Ne mogu dodati" });
      res.status(201).json({ id: result.insertId, message: "Igra dodata" });
    }
  );
});

router.delete("/ratings/:ratingId", auth, adminOnly, (req, res) => {
  db.query("DELETE FROM ocjena WHERE id = ?", [req.params.ratingId], (err, result) => {
    if (err) return res.status(500).json({ error: "Greška pri brisanju." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Ocjena ne postoji." });
    res.json({ message: "Ocjena obrisana." });
  });
});

router.delete("/:id", auth, adminOnly, (req, res) => {
  db.query("DELETE FROM igra WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Ne mogu obrisati" });
    res.json({ message: "Igra obrisana" });
  });
});

router.post("/:id/rate", auth, (req, res) => {
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

router.get("/:id/ratings", (req, res) => {
  db.query(
    `SELECT o.id, k.ime AS korisnik, o.ocjena, o.komentar, o.datum
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

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Dodaj u wishlistu
router.post("/", (req, res) => {
  const { korisnik_id, igra_id } = req.body;
  db.query(
    "INSERT INTO wishlist (korisnik_id, igra_id) VALUES (?, ?)",
    [korisnik_id, igra_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška pri dodavanju." });
      res.status(201).json({ message: "Dodato u wishlist!" });
    }
  );
});

// Ukloni iz wishlist-e
router.delete("/", (req, res) => {
  const { korisnik_id, igra_id } = req.body;
  db.query(
    "DELETE FROM wishlist WHERE korisnik_id = ? AND igra_id = ?",
    [korisnik_id, igra_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška pri brisanju." });
      res.json({ message: "Uklonjeno iz wishlist-e!" });
    }
  );
});

// Dohvati wishlist-u korisnika
router.get("/:korisnik_id", (req, res) => {
  db.query(
    `SELECT i.* FROM wishlist w JOIN igra i ON w.igra_id = i.id WHERE w.korisnik_id = ?`,
    [req.params.korisnik_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Greška u bazi." });
      res.json(result);
    }
  );
});
router.get("/:korisnik_id/wishlist", (req, res) => {
  db.query(
    `SELECT i.* FROM wishlist w JOIN igra i ON w.igra_id = i.id WHERE w.korisnik_id = ?`,
    [req.params.korisnik_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Greška u bazi." });
      res.json(results);
    }
  );
});

module.exports = router;

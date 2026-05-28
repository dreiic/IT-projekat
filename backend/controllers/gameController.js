// backend/controllers/gameController.js
const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM igra", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Greška pri dohvatu igrica." });
    }
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { naziv, zanr, slika_url, kupi_url } = req.body;
  if (!naziv || !zanr || !slika_url || !kupi_url) {
    return res.status(400).json({ error: "Nedostaju podaci." });
  }
  const sql = "INSERT INTO igra (naziv, zanr, slika_url, kupi_url) VALUES (?, ?, ?, ?)";
  db.query(sql, [naziv, zanr, slika_url, kupi_url], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ne mogu dodati igru." });
    }
    res.status(201).json({ id: result.insertId, message: "Igra dodata." });
  });
};

exports.remove = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM igra WHERE id = ?", [id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Ne mogu obrisati igru." });
    }
    res.json({ message: "Igra obrisana." });
  });
};

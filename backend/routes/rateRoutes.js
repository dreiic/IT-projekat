router.post("/:id/rate", (req, res) => {
  const gameId = parseInt(req.params.id);
  const { userId, rating, comment } = req.body;

  if (!userId || !rating) {
    return res.status(400).json({ message: "Nedostaje korisnik ili ocjena." });
  }

  const sql = `INSERT INTO ocjena (korisnik_id, igra_id, ocjena, komentar) VALUES (?, ?, ?, ?)`;
  db.query(sql, [userId, gameId, rating, comment], (err, result) => {
    if (err) {
      console.error("Greška pri upisu ocjene:", err);
      return res.status(500).json({ message: "Greška u bazi." });
    }
    res.json({ success: true });
  });
});

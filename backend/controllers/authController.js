const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");
const transporter = require("../config/mailer");

exports.login = (req, res) => {
  const { email, lozinka } = req.body;
  db.query("SELECT * FROM korisnik WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Greška u bazi." });
    if (result.length === 0) return res.status(401).json({ message: "Email ne postoji." });

    const korisnik = result[0];

    if (lozinka !== korisnik.lozinka) {
      return res.status(401).json({ message: "Pogrešna lozinka." });
    }

    if (!korisnik.verified) {
      return res.status(403).json({ message: "Nalog nije verifikovan. Provjeri email." });
    }

    const token = jwt.sign(
      { id: korisnik.id, role: korisnik.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      korisnik: {
        id: korisnik.id,
        ime: korisnik.ime,
        prezime: korisnik.prezime,
        email: korisnik.email,
        role: korisnik.role
      }
    });
  });
};

exports.register = (req, res) => {
  const { ime, prezime, email, lozinka } = req.body;
  const verificationToken = crypto.randomBytes(32).toString("hex");

  db.query(
    "INSERT INTO korisnik (ime, prezime, email, lozinka, verified, verification_token) VALUES (?, ?, ?, ?, 0, ?)",
    [ime, prezime, email, lozinka, verificationToken],
    async (err) => {
      if (err) return res.status(500).json({ message: "Greška pri registraciji." });

      const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

      try {
        await transporter.sendMail({
          from: `"GameRate" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Verifikuj nalog na GameRate",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #111; color: #e0e0e0; border-radius: 8px;">
              <h2 style="color: #fff; font-size: 20px; margin: 0 0 8px 0;">🎮 GameRate</h2>
              <p style="color: #a0a0a0; margin: 0 0 24px 0;">Hvala na registraciji, ${ime}!</p>
              <p style="margin: 0 0 20px 0;">Klikni dugme ispod da aktiviraš nalog:</p>
              <a href="${verifyLink}" style="display: inline-block; background: #f59e0b; color: #111; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 700;">
                Verifikuj nalog
              </a>
              <p style="margin: 24px 0 0 0; color: #555; font-size: 12px;">Ako nisi ti kreirao nalog, ignoriši ovaj email.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error("Email nije poslan:", mailErr.message);
      }

      res.status(201).json({ message: "Registracija uspješna! Provjeri email za verifikaciju." });
    }
  );
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  db.query("SELECT * FROM korisnik WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Greška u bazi." });
    if (result.length === 0) return res.status(404).json({ message: "Email ne postoji." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 sat

    db.query(
      "UPDATE korisnik SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [token, expires, email],
      async (err) => {
        if (err) return res.status(500).json({ message: "Greška u bazi." });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        try {
          await transporter.sendMail({
            from: `"GameRate" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset lozinke — GameRate",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#111;color:#e0e0e0;border-radius:8px;">
                <h2 style="color:#fff;font-size:20px;margin:0 0 8px 0;">🎮 GameRate</h2>
                <p style="color:#a0a0a0;margin:0 0 24px 0;">Primili smo zahtjev za reset lozinke.</p>
                <p style="margin:0 0 20px 0;">Klikni dugme ispod — link važi <strong>1 sat</strong>:</p>
                <a href="${resetLink}" style="display:inline-block;background:#f59e0b;color:#111;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:700;">
                  Resetuj lozinku
                </a>
                <p style="margin:24px 0 0 0;color:#555;font-size:12px;">Ako nisi ti zatražio reset, ignoriši ovaj email.</p>
              </div>
            `
          });
        } catch (mailErr) {
          console.error("Email nije poslan:", mailErr.message);
        }

        res.json({ message: "Link za reset poslan na email." });
      }
    );
  });
};

exports.resetPassword = (req, res) => {
  const { token, lozinka } = req.body;
  db.query(
    "SELECT * FROM korisnik WHERE reset_token = ? AND reset_token_expires > NOW()",
    [token],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Greška u bazi." });
      if (result.length === 0) return res.status(400).json({ message: "Token je nevažeći ili istekao." });

      db.query(
        "UPDATE korisnik SET lozinka = ?, reset_token = NULL, reset_token_expires = NULL WHERE reset_token = ?",
        [lozinka, token],
        (err) => {
          if (err) return res.status(500).json({ message: "Greška pri promjeni lozinke." });
          res.json({ message: "Lozinka uspješno promijenjena." });
        }
      );
    }
  );
};

exports.verify = (req, res) => {
  const { token } = req.params;
  db.query(
    "UPDATE korisnik SET verified = 1, verification_token = NULL WHERE verification_token = ?",
    [token],
    (err, result) => {
      if (err) return res.status(500).send("Greška u bazi.");
      if (result.affectedRows === 0) return res.status(400).send(`
        <div style="font-family:Arial;text-align:center;padding:60px;background:#111;color:#e0e0e0;min-height:100vh">
          <h2 style="color:#ef4444">Nevažeći ili istekli link.</h2>
        </div>
      `);
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>GameRate — Verifikacija</title></head>
        <body style="font-family:Arial,sans-serif;background:#111;color:#e0e0e0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
          <div style="text-align:center;padding:40px">
            <div style="font-size:48px;margin-bottom:16px">🎮</div>
            <h2 style="color:#fff;margin:0 0 8px 0">Nalog verifikovan!</h2>
            <p style="color:#a0a0a0;margin:0 0 24px 0">Možeš se sada prijaviti na GameRate.</p>
            <a href="http://localhost:3000" style="display:inline-block;background:#f59e0b;color:#111;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:700">
              Idi na prijavu
            </a>
          </div>
        </body>
        </html>
      `);
    }
  );
};

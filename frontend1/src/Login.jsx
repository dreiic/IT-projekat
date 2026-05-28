import { useState } from "react";

function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const justVerified = new URLSearchParams(window.location.search).get("verified") === "1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lozinka }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGreska(data.message || "Greška pri loginu.");
      } else {
        setGreska("");
        localStorage.setItem("token", data.token);
        localStorage.setItem("korisnik", JSON.stringify(data.korisnik));
        onLogin(data.korisnik, data.token);
      }
    } catch (err) {
      setGreska("Greška na serveru.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
          <i className="fas fa-gamepad" style={{ fontSize: "22px", color: "#fff" }}></i>
          <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>GameRate</span>
        </div>
        <h2 className="auth-title">Prijava</h2>
        {justVerified && (
          <p style={{ background: "rgba(62,207,142,0.1)", border: "1px solid #3ecf8e", color: "#3ecf8e", borderRadius: "4px", padding: "10px 12px", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
            Nalog verifikovan! Možeš se prijaviti.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email adresa</label>
            <input
              type="email"
              className="form-control"
              placeholder="Unesite email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Lozinka</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Unesite lozinku"
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#555",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Prijavi se
          </button>
          {greska && (
            <p style={{ background: "rgba(239,68,68,0.08)", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "4px", padding: "10px 12px", fontSize: "13px", marginTop: "12px" }}>
              {greska}
            </p>
          )}
        </form>
        <div className="auth-footer">
          Nemate nalog?{" "}
          <button
            className="auth-link"
            onClick={onSwitch}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            Registrujte se
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

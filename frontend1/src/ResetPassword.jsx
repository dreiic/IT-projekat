import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "./Toast";

export default function ResetPassword() {
  const [lozinka, setLozinka] = useState("");
  const [potvrda, setPotvrda] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lozinka !== potvrda) {
      toast("Lozinke se ne podudaraju.", "warning");
      return;
    }
    if (lozinka.length < 6) {
      toast("Lozinka mora imati najmanje 6 karaktera.", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, lozinka }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.message || "Greška.");
      } else {
        setDone(true);
      }
    } catch {
      toast("Greška na serveru.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444" }}>Nevažeći link za reset.</p>
          <button onClick={() => navigate("/")} className="btn btn-primary" style={{ marginTop: "16px" }}>Nazad</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
          <i className="fas fa-gamepad" style={{ fontSize: "22px", color: "#fff" }}></i>
          <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>GameRate</span>
        </div>
        <h2 className="auth-title">Nova lozinka</h2>

        {done ? (
          <div>
            <p style={{ background: "rgba(62,207,142,0.08)", border: "1px solid #3ecf8e", color: "#3ecf8e", borderRadius: "4px", padding: "12px", fontSize: "14px", textAlign: "center" }}>
              Lozinka uspješno promijenjena!
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary"
              style={{ marginTop: "16px", width: "100%" }}
            >
              Prijavi se
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nova lozinka</label>
              <input
                type="password"
                className="form-control"
                placeholder="Minimum 6 karaktera"
                value={lozinka}
                onChange={e => setLozinka(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Potvrdi lozinku</label>
              <input
                type="password"
                className="form-control"
                placeholder="Ponovi lozinku"
                value={potvrda}
                onChange={e => setPotvrda(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Čuvanje..." : "Sačuvaj lozinku"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

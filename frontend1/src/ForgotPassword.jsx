import { useState } from "react";
import { useToast } from "./Toast";

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.message || "Greška.");
      } else {
        setSent(true);
      }
    } catch {
      toast("Greška na serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
          <i className="fas fa-gamepad" style={{ fontSize: "22px", color: "#fff" }}></i>
          <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.02em", color: "#fff" }}>GameRate</span>
        </div>
        <h2 className="auth-title">Zaboravljena lozinka</h2>

        {sent ? (
          <div>
            <p style={{ background: "rgba(62,207,142,0.08)", border: "1px solid #3ecf8e", color: "#3ecf8e", borderRadius: "4px", padding: "12px", fontSize: "14px", textAlign: "center" }}>
              Link za reset poslan na email. Provjeri inbox.
            </p>
            <button
              onClick={onBack}
              style={{ marginTop: "16px", width: "100%", padding: "10px", background: "none", border: "1px solid #444", color: "#aaa", borderRadius: "4px", cursor: "pointer", fontSize: "14px" }}
            >
              Nazad na prijavu
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email adresa</label>
              <input
                type="email"
                className="form-control"
                placeholder="Unesite vaš email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Slanje..." : "Pošalji link"}
            </button>
          </form>
        )}

        {!sent && (
          <div className="auth-footer">
            <button
              onClick={onBack}
              style={{ background: "none", border: "none", color: "#a0a0a0", cursor: "pointer", fontSize: "13px" }}
            >
              Nazad na prijavu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/users/${id}`)
      .then(res => res.json())
      .then(setUser);

    fetch(`http://localhost:5001/api/wishlist/${id}`)
      .then(res => res.json())
      .then(setWishlist);

    fetch(`http://localhost:5001/api/users/${id}/reviews`)
      .then(res => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [id]);

  if (!user) return (
    <div style={{ minHeight: "100vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "'Inter', sans-serif" }}>
      Učitavanje...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#111", fontFamily: "'Inter', sans-serif", color: "#e0e0e0" }}>

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2.5rem",
        height: "64px",
        background: "#0f0f0f",
        borderBottom: "1px solid #242424",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <a href="/" style={{ textDecoration: "none", color: "#fff", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fas fa-gamepad"></i>
          GameRate
        </a>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            color: "#a0a0a0",
            padding: "6px 14px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "inherit",
            transition: "color 0.15s ease, border-color 0.15s ease"
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#e0e0e0"; e.currentTarget.style.borderColor = "#555"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#a0a0a0"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
        >
          ← Nazad
        </button>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Profile strip */}
        <div style={{
          background: "#161616",
          border: "1px solid #222",
          borderRadius: "8px",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px"
        }}>
          <img
            src={user.profilna_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.ime + " " + user.prezime)}&size=80&background=1a1a1a&color=e0e0e0&bold=true`}
            alt="Profilna"
            style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid #2a2a2a" }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: "0 0 3px 0", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.02em", color: "#fff" }}>
              {user.ime} {user.prezime}
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>{user.email}</p>
            {user.opis && (
              <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#a0a0a0" }}>{user.opis}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: "24px", flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>{wishlist.length}</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Wishlist</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>{reviews.length}</div>
              <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>Recenzija</div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "16px", alignItems: "start" }}>

          {/* Left: Wishlist */}
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e1e" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0e0e0" }}>Wishlist</span>
            </div>

            {wishlist.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#333", fontSize: "13px" }}>
                Prazna
              </div>
            ) : (
              <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                {wishlist.map(game => (
                  <div
                    key={game.id}
                    onClick={() => navigate(`/game/${game.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      borderBottom: "1px solid #1a1a1a",
                      cursor: "pointer",
                      transition: "background 0.12s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={game.slika_url}
                      alt={game.naziv}
                      style={{ width: "32px", height: "42px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {game.naziv}
                      </div>
                      <div style={{ fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "2px" }}>
                        {game.zanr}
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Reviews */}
          <div style={{ background: "#161616", border: "1px solid #222", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e1e" }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#e0e0e0" }}>Recenzije</span>
            </div>

            {reviews.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#333", fontSize: "13px" }}>
                Nema recenzija
              </div>
            ) : (
              <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                {reviews.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => navigate(`/game/${r.igra_id}`)}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px 16px",
                      borderBottom: "1px solid #1a1a1a",
                      cursor: "pointer",
                      transition: "background 0.12s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={r.slika_url}
                      alt={r.naziv}
                      style={{ width: "36px", height: "48px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {r.naziv}
                        </span>
                        <div style={{ display: "flex", gap: "1px", flexShrink: 0 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ color: s <= r.ocjena ? "#f59e0b" : "#2a2a2a", fontSize: "12px" }}>★</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#444", marginBottom: "5px" }}>
                        {r.zanr} · {new Date(r.datum).toLocaleDateString("bs-BA")}
                      </div>
                      {r.komentar && (
                        <p style={{ margin: 0, fontSize: "12px", color: "#a0a0a0", lineHeight: 1.5 }}>{r.komentar}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

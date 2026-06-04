import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./App.css";
import "./GameDetails.css";

const API = "http://localhost:5001";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistHover, setWishlistHover] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("korisnik") || "null");
  const token = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    fetch(`${API}/api/games`)
      .then(r => r.json())
      .then(data => setGame(data.find(g => g.id === parseInt(id))));

    fetch(`${API}/api/games/${id}/ratings`)
      .then(r => r.json())
      .then(setRatings);

    if (currentUser) {
      fetch(`${API}/api/wishlist/${currentUser.id}`)
        .then(r => r.json())
        .then(data => setInWishlist(data.some(g => g.id === parseInt(id))));
    }
  }, [id]);

  async function toggleWishlist() {
    if (!currentUser) return;
    await fetch(`${API}/api/wishlist`, {
      method: inWishlist ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ korisnik_id: currentUser.id, igra_id: parseInt(id) })
    });
    setInWishlist(!inWishlist);
  }

  async function deleteRating(ratingId) {
    await fetch(`${API}/api/games/ratings/${ratingId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setRatings(prev => prev.filter(r => r.id !== ratingId));
  }

  if (!game) return <p>Učitavanje...</p>;

  const average = ratings.length
    ? ratings.reduce((sum, r) => sum + r.ocjena, 0) / ratings.length
    : 0;

  return (
    <div className="game-details-container">
      <button className="btn back-btn" onClick={() => navigate("/dashboard")}>← Nazad</button>

      <div className="game-header-split">
        <div className="game-left">
          <img src={game.slika_url} alt={game.naziv} className="game-banner-split" />
        </div>

        <div className="game-right">
          <h2>{game.naziv}</h2>
          <p><strong>Žanr:</strong> {game.zanr}</p>
          <p>
            <strong>Prosječna ocjena:</strong>{" "}
            {"★".repeat(Math.round(average))} ({ratings.length} ocjena)
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "1.2rem" }}>
            <a href={game.kupi_url} className="btn kupi-btn" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Kupi igru
            </a>

            {currentUser && (
              <button onClick={toggleWishlist}
                onMouseEnter={() => setWishlistHover(true)}
                onMouseLeave={() => setWishlistHover(false)}
                title={inWishlist ? "Ukloni iz wishlist-e" : "Dodaj u wishlist"}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "42px", height: "42px", borderRadius: "6px", cursor: "pointer",
                  border: `1.5px solid ${inWishlist || wishlistHover ? "#22c55e" : "#444"}`,
                  background: inWishlist ? "rgba(34,197,94,0.12)" : wishlistHover ? "rgba(34,197,94,0.08)" : "transparent",
                  transition: "all 0.18s ease"
                }}
              >
                <svg width="16" height="18" viewBox="0 0 16 20"
                  fill={inWishlist ? "#22c55e" : "none"}
                  stroke={inWishlist ? "#22c55e" : wishlistHover ? "#22c55e" : "#888"}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: "all 0.18s ease" }}
                >
                  <path d="M2 2h12v16l-6-4-6 4V2z"/>
                </svg>
              </button>
            )}
          </div>

          <div className="ratings-section">
            <h3>Komentari korisnika</h3>
            {ratings.length === 0 && <p>Još nema komentara.</p>}
            {ratings.map((r, i) => (
              <div key={i} className="rating-card" style={{ position: "relative" }}>
                <div className="rating-stars">
                  {"★".repeat(r.ocjena)}{"☆".repeat(5 - r.ocjena)}
                </div>
                <p><strong>{r.korisnik}</strong> – {new Date(r.datum).toLocaleString()}</p>
                <p>{r.komentar}</p>
                {isAdmin && (
                  <button onClick={() => deleteRating(r.id)} title="Obriši review"
                    style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", cursor: "pointer", color: "#555", padding: "4px", borderRadius: "4px" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={e => e.currentTarget.style.color = "#555"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

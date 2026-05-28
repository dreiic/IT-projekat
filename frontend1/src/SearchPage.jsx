import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./App.css";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [allGames, setAllGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [naziv, setNaziv] = useState(searchParams.get("q") || "");
  const [zanr, setZanr] = useState("");
  const [minOcjena, setMinOcjena] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch all games with average ratings on mount
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5001/api/games").then(r => r.json()),
      fetch("http://localhost:5001/api/games/genres").then(r => r.json())
    ]).then(async ([gamesData, genresData]) => {
      const gamesWithAvg = await Promise.all(
        gamesData.map(async (g) => {
          try {
            const res = await fetch(`http://localhost:5001/api/games/${g.id}/ratings`);
            if (!res.ok) return { ...g, average: 0 };
            const ratings = await res.json();
            const avg = ratings.length > 0
              ? ratings.reduce((sum, r) => sum + r.ocjena, 0) / ratings.length
              : 0;
            return { ...g, average: avg, ratingCount: ratings.length };
          } catch {
            return { ...g, average: 0, ratingCount: 0 };
          }
        })
      );
      setAllGames(gamesWithAvg);
      setGenres(genresData);
      setLoading(false);
    });
  }, []);

  // Apply filters and sort
  const results = allGames
    .filter(g => naziv ? g.naziv.toLowerCase().includes(naziv.toLowerCase()) : true)
    .filter(g => zanr ? g.zanr === zanr : true)
    .filter(g => minOcjena ? g.average >= parseFloat(minOcjena) : true)
    .sort((a, b) => {
      if (sortBy === "rating_desc") return b.average - a.average;
      if (sortBy === "rating_asc") return a.average - b.average;
      if (sortBy === "naziv_asc") return a.naziv.localeCompare(b.naziv);
      if (sortBy === "naziv_desc") return b.naziv.localeCompare(a.naziv);
      return 0;
    });

  function renderStars(avg) {
    const rounded = Math.round(avg || 0);
    return [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= rounded ? "#f59e0b" : "#2a2a2a", fontSize: "0.85rem" }}>★</span>
    ));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111", color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 28px",
        background: "#111",
        borderBottom: "1px solid #222"
      }}>
        <a href="/" style={{ textDecoration: "none", color: "#fff", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em" }}>
          GameRate
        </a>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            color: "#a0a0a0",
            padding: "6px 14px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "inherit"
          }}
        >
          ← Nazad
        </button>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", color: "#fff", margin: "0 0 4px 0" }}>
            Detaljna pretraga
          </h1>
          <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>
            Pretraži igre po nazivu, žanru i ocjeni
          </p>
        </div>

        {/* Filter form */}
        <div style={{
          background: "#161616",
          border: "1px solid #222",
          borderRadius: "6px",
          padding: "20px",
          marginBottom: "28px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "12px"
        }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Naziv igre
            </label>
            <input
              type="text"
              placeholder="npr. Witcher..."
              value={naziv}
              onChange={e => setNaziv(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e0e0e0",
                fontSize: "13px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.borderColor = "#f59e0b"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Žanr
            </label>
            <select
              value={zanr}
              onChange={e => setZanr(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: zanr ? "#e0e0e0" : "#666",
                fontSize: "13px",
                outline: "none",
                fontFamily: "inherit"
              }}
            >
              <option value="">Svi žanrovi</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Min. ocjena
            </label>
            <select
              value={minOcjena}
              onChange={e => setMinOcjena(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: minOcjena ? "#e0e0e0" : "#666",
                fontSize: "13px",
                outline: "none",
                fontFamily: "inherit"
              }}
            >
              <option value="">Bilo koja</option>
              <option value="1">★ 1+</option>
              <option value="2">★★ 2+</option>
              <option value="3">★★★ 3+</option>
              <option value="4">★★★★ 4+</option>
              <option value="5">★★★★★ 5</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Sortiranje
            </label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: sortBy ? "#e0e0e0" : "#666",
                fontSize: "13px",
                outline: "none",
                fontFamily: "inherit"
              }}
            >
              <option value="">Podrazumijevano</option>
              <option value="rating_desc">Ocjena ↓</option>
              <option value="rating_asc">Ocjena ↑</option>
              <option value="naziv_asc">Naziv A–Z</option>
              <option value="naziv_desc">Naziv Z–A</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: "16px", fontSize: "13px", color: "#555" }}>
          {loading ? "Učitavanje..." : `${results.length} ${results.length === 1 ? "igra" : "igara"}`}
        </div>

        {/* Results grid */}
        {!loading && results.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#333",
            border: "1px solid #1e1e1e",
            borderRadius: "6px"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>☐</div>
            <div style={{ fontSize: "14px" }}>Nema rezultata za zadane filtere</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem"
          }}>
            {results.map(game => (
              <div
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #222",
                  borderRadius: "6px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "border-color 0.15s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#f59e0b"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
              >
                <img
                  src={game.slika_url}
                  alt={game.naziv}
                  style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#e0e0e0", marginBottom: "4px", letterSpacing: "-0.01em" }}>
                    {game.naziv}
                  </div>
                  <div style={{ fontSize: "11px", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {game.zanr}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div>{renderStars(game.average)}</div>
                    {game.average > 0 && (
                      <span style={{ fontSize: "11px", color: "#555" }}>
                        {game.average.toFixed(1)} ({game.ratingCount})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

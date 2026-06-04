import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";
import RatingModal from "./RatingModal";
import EditProfileModal from "./EditProfileModal";
import WishlistModal from "./WishlistModal";
import "./App.css";

const API = "http://localhost:5001";
const GAMES_PER_PAGE = 15;

export default function Dashboard({ currentUser, token, onLogout }) {
  const toast = useToast();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === "admin";

  const [games, setGames] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [zanrovi, setZanrovi] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [filterGenre, setFilterGenre] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [navSearch, setNavSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const userMenuRef = useRef(null);
  const navSearchRef = useRef(null);
  const userSearchRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (navSearchRef.current && !navSearchRef.current.contains(e.target)) setNavSearch("");
      if (userSearchRef.current && !userSearchRef.current.contains(e.target)) {
        setShowUserSearch(false);
        setUserSearch("");
        setUserSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/games`)
      .then(r => r.json())
      .then(async data => {
        const withAvg = await Promise.all(data.map(async g => {
          try {
            const res = await fetch(`${API}/api/games/${g.id}/ratings`);
            if (!res.ok) return { ...g, average: 0 };
            const ratings = await res.json();
            const avg = ratings.length ? ratings.reduce((s, r) => s + r.ocjena, 0) / ratings.length : 0;
            return { ...g, average: avg };
          } catch {
            return { ...g, average: 0 };
          }
        }));
        setGames(withAvg);
      });

    fetch(`${API}/api/wishlist/${currentUser.id}`)
      .then(r => r.json())
      .then(setWishlist);

    fetch(`${API}/api/games/genres`)
      .then(r => r.json())
      .then(setZanrovi)
      .catch(() => []);
  }, [currentUser.id]);

  useEffect(() => {
    if (!userSearch.trim()) { setUserSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`${API}/api/users/search?q=${encodeURIComponent(userSearch)}`)
        .then(r => r.json())
        .then(setUserSearchResults)
        .catch(() => setUserSearchResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [userSearch]);

  async function handleDelete(id) {
    if (!window.confirm("Obrisati igru?")) return;
    const res = await fetch(`${API}/api/games/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setGames(g => g.filter(x => x.id !== id));
    else toast("Greška kod brisanja");
  }

  async function handleWishlistToggle(igra_id, inWishlist) {
    await fetch(`${API}/api/wishlist`, {
      method: inWishlist ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ korisnik_id: currentUser.id, igra_id })
    });
    if (inWishlist) {
      setWishlist(w => w.filter(x => x.id !== igra_id));
    } else {
      const wl = await fetch(`${API}/api/wishlist/${currentUser.id}`).then(r => r.json());
      setWishlist(wl);
    }
  }

  function updateProfileLocal(updated) {
    Object.assign(currentUser, updated);
    localStorage.setItem("korisnik", JSON.stringify(currentUser));
    setShowEdit(false);
    window.location.reload();
  }

  function renderStars(avg = 0) {
    const rounded = Math.round(avg);
    return (
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map(i => (
          <i key={i} className={i <= rounded ? "fas fa-star star-filled" : "far fa-star star-empty"} />
        ))}
        <span className="stars-avg">{avg ? avg.toFixed(1) : "N/A"}</span>
      </div>
    );
  }

  const navSearchResults = navSearch.trim()
    ? games.filter(g => g.naziv.toLowerCase().includes(navSearch.toLowerCase())).slice(0, 6)
    : [];

  const filteredGames = games
    .filter(g => filterGenre ? g.zanr === filterGenre : true)
    .sort((a, b) => {
      if (sortBy === "rating_desc") return (b.average || 0) - (a.average || 0);
      if (sortBy === "rating_asc") return (a.average || 0) - (b.average || 0);
      if (sortBy === "naziv_asc") return a.naziv.localeCompare(b.naziv);
      if (sortBy === "naziv_desc") return b.naziv.localeCompare(a.naziv);
      return 0;
    });

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredGames.slice((currentPage - 1) * GAMES_PER_PAGE, currentPage * GAMES_PER_PAGE);

  const avatarUrl = name => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=e0e0e0`;

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="logo" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#fff", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em" }}>
            <i className="fas fa-gamepad" style={{ marginRight: "8px" }}></i>
            GameRate
          </a>

          {/* Brza pretraga */}
          <div ref={navSearchRef} style={{ position: "relative" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <svg style={{ position: "absolute", left: "10px", color: "#555", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Pretraži igre..."
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                style={{ padding: "7px 14px 7px 32px", fontSize: "13px", borderRadius: "4px", border: "1px solid #2a2a2a", width: "260px", outline: "none", backgroundColor: "#1a1a1a", color: "#e0e0e0" }}
              />
            </div>
            {navSearch.trim() && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#161616", border: "1px solid #2a2a2a", borderRadius: "4px", zIndex: 1000, overflow: "hidden" }}>
                {navSearchResults.length === 0
                  ? <div style={{ padding: "12px 14px", fontSize: "13px", color: "#555" }}>Nema rezultata</div>
                  : navSearchResults.map(game => (
                    <div key={game.id} onClick={() => { navigate(`/game/${game.id}`); setNavSearch(""); }}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", cursor: "pointer", borderBottom: "1px solid #1e1e1e" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <img src={game.slika_url} alt={game.naziv} style={{ width: "32px", height: "40px", objectFit: "cover", borderRadius: "2px" }} />
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{game.naziv}</div>
                        <div style={{ fontSize: "11px", color: "#555" }}>{game.zanr}</div>
                      </div>
                      {game.average > 0 && <div style={{ marginLeft: "auto", fontSize: "12px", color: "#f59e0b" }}>★ {game.average.toFixed(1)}</div>}
                    </div>
                  ))
                }
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Wishlist dugme */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowWishlist(true)} title="Wishlist"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#a0a0a0", padding: "9px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#e0e0e0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#a0a0a0"; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
                </svg>
              </button>
              {wishlist.length > 0 && (
                <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#f59e0b", color: "#111", fontSize: "10px", fontWeight: "700", borderRadius: "10px", padding: "2px 5px", minWidth: "18px", textAlign: "center" }}>
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Pretraga korisnika */}
            <div ref={userSearchRef} style={{ position: "relative" }}>
              <button onClick={() => { setShowUserSearch(v => !v); setUserSearch(""); setUserSearchResults([]); }} title="Pretraži korisnike"
                style={{ background: showUserSearch ? "#1a1a1a" : "transparent", border: "1px solid", borderColor: showUserSearch ? "#333" : "#1e1e1e", color: showUserSearch ? "#e0e0e0" : "#555", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center" }}
                onMouseEnter={e => { if (!showUserSearch) { e.currentTarget.style.color = "#e0e0e0"; e.currentTarget.style.borderColor = "#333"; }}}
                onMouseLeave={e => { if (!showUserSearch) { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#1e1e1e"; }}}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.1992 12C14.9606 12 17.1992 9.76142 17.1992 7C17.1992 4.23858 14.9606 2 12.1992 2C9.43779 2 7.19922 4.23858 7.19922 7C7.19922 9.76142 9.43779 12 12.1992 12Z"/>
                  <path d="M3 22C3.57038 20.0332 4.74795 18.2971 6.36438 17.0399C7.98081 15.7827 9.95335 15.0687 12 15"/>
                  <path d="M18.3795 20.8199C20.2793 20.8199 21.8195 19.2798 21.8195 17.3799C21.8195 15.4801 20.2793 13.9399 18.3795 13.9399C16.4796 13.9399 14.9395 15.4801 14.9395 17.3799C14.9395 19.2798 16.4796 20.8199 18.3795 20.8199Z"/>
                  <path d="M22.9406 21.9401L20.8105 19.8101"/>
                </svg>
              </button>
              {showUserSearch && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, width: "280px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: "6px", zIndex: 300, overflow: "hidden" }}>
                  <div style={{ padding: "10px" }}>
                    <input autoFocus type="text" placeholder="Pretraži korisnike..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                      style={{ width: "100%", padding: "7px 10px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "4px", color: "#e0e0e0", fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                      onFocus={e => e.target.style.borderColor = "#f59e0b"}
                      onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                    />
                  </div>
                  {userSearchResults.length > 0
                    ? userSearchResults.map(u => (
                      <div key={u.id} onClick={() => { navigate(`/user/${u.id}`); setShowUserSearch(false); setUserSearch(""); setUserSearchResults([]); }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", cursor: "pointer", borderTop: "1px solid #1e1e1e" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <img src={u.profilna_url || avatarUrl(u.ime)} alt={u.ime} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{u.ime} {u.prezime}</div>
                          <div style={{ fontSize: "11px", color: "#555" }}>{u.email}</div>
                        </div>
                      </div>
                    ))
                    : <div style={{ padding: "12px", fontSize: "13px", color: "#555", borderTop: "1px solid #1e1e1e" }}>
                        {userSearch.trim() ? "Nema rezultata" : "Ukucaj ime ili email korisnika"}
                      </div>
                  }
                </div>
              )}
            </div>

            {/* User meni */}
            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button onClick={() => setShowUserMenu(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: "8px", background: showUserMenu ? "#1a1a1a" : "transparent", border: "1px solid", borderColor: showUserMenu ? "#333" : "transparent", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}
                onMouseEnter={e => { if (!showUserMenu) { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "#2a2a2a"; }}}
                onMouseLeave={e => { if (!showUserMenu) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}}
              >
                <img src={currentUser.profilna_url || avatarUrl(currentUser.ime)} alt="profilna" style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} />
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{currentUser.ime}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showUserMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#161616", border: "1px solid #2a2a2a", borderRadius: "6px", minWidth: "200px", zIndex: 500, overflow: "hidden" }}>
                  <div style={{ padding: "12px 14px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={currentUser.profilna_url || avatarUrl(currentUser.ime)} alt="profilna" style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{currentUser.ime} {currentUser.prezime}</div>
                      <div style={{ fontSize: "11px", color: "#555" }}>{currentUser.email}</div>
                    </div>
                  </div>
                  {[
                    { label: "Uredi profil", onClick: () => { setShowEdit(true); setShowUserMenu(false); }, danger: false },
                    { label: "Wishlist", onClick: () => { setShowWishlist(true); setShowUserMenu(false); }, danger: false },
                    { label: "Odjavi se", onClick: onLogout, danger: true }
                  ].map(item => (
                    <button key={item.label} onClick={item.onClick}
                      style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "transparent", border: "none", color: item.danger ? "#ef4444" : "#a0a0a0", fontSize: "13px", cursor: "pointer", textAlign: "left" }}
                      onMouseEnter={e => { e.currentTarget.style.background = item.danger ? "rgba(239,68,68,0.08)" : "#1a1a1a"; e.currentTarget.style.color = item.danger ? "#f87171" : "#e0e0e0"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = item.danger ? "#ef4444" : "#a0a0a0"; }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showEdit && (
        <EditProfileModal currentUser={currentUser} token={token} onClose={() => setShowEdit(false)} onProfileUpdate={updateProfileLocal} onDelete={onLogout} />
      )}
      {showWishlist && (
        <WishlistModal wishlist={wishlist} onClose={() => setShowWishlist(false)} navigate={navigate} />
      )}

      <main style={{ padding: "28px 32px", paddingTop: "88px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #1e1e1e", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ margin: 0, color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Dobrodošli nazad</p>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", color: "#fff" }}>
              {currentUser.ime} {currentUser.prezime} <span className="wave">👋</span>
            </h2>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <select value={filterGenre} onChange={e => { setFilterGenre(e.target.value); setCurrentPage(1); }}
              style={{ padding: "7px 10px", borderRadius: "4px", border: "1px solid #2a2a2a", fontSize: "13px", background: "#1a1a1a", color: "#a0a0a0" }}>
              <option value="">Svi žanrovi</option>
              {zanrovi.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
              style={{ padding: "7px 10px", borderRadius: "4px", border: "1px solid #2a2a2a", fontSize: "13px", background: "#1a1a1a", color: "#a0a0a0" }}>
              <option value="">Sortiraj po</option>
              <option value="rating_desc">Ocjena ↓</option>
              <option value="rating_asc">Ocjena ↑</option>
              <option value="naziv_asc">Naziv A–Z</option>
              <option value="naziv_desc">Naziv Z–A</option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => navigate("/add-game")}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f59e0b", color: "#111", border: "none", padding: "9px 18px", borderRadius: "4px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => e.currentTarget.style.background = "#fbbf24"}
              onMouseLeave={e => e.currentTarget.style.background = "#f59e0b"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Dodaj igru
            </button>
          </div>
        )}

        <div className="games-grid">
          {paginatedGames.map(game => {
            const inWishlist = wishlist.some(w => w.id === game.id);
            return (
              <div key={game.id} className="game-card-new">
                <div className="game-img-container" onClick={() => navigate(`/game/${game.id}`)}>
                  <img src={game.slika_url} alt={game.naziv} className="game-cover-new" />
                </div>
                <div className="game-body-new">
                  <h3>{game.naziv}</h3>
                  <span className="game-genre-new">{game.zanr}</span>
                  <div className="game-rating-row">{renderStars(game.average)}</div>
                  <div className="game-meta-new">
                    <button className="btn-rate" onClick={() => setSelectedGame(game)}>Ocijeni</button>
                    <button
                      onClick={() => handleWishlistToggle(game.id, inWishlist)}
                      title={inWishlist ? "Ukloni iz wishliste" : "Dodaj u wishlistu"}
                      style={{ background: inWishlist ? "rgba(62,207,142,0.08)" : "transparent", border: `1px solid ${inWishlist ? "#3ecf8e" : "#2a2a2a"}`, color: inWishlist ? "#3ecf8e" : "#555", padding: "6px 8px", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        {inWishlist
                          ? <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
                          : <path d="M14,10h-1V9c0-0.6-0.4-1-1-1s-1,0.4-1,1v1h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h1v1c0,0.6,0.4,1,1,1s1-0.4,1-1v-1h1c0.6,0,1-0.4,1-1S14.6,10,14,10z M19,3h-1H6H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z M17,19.1l-3.9-2.6c-0.3-0.2-0.7-0.3-1.1-0.3s-0.8,0.1-1.1,0.3L7,19.1V5h10V19.1z"/>
                        }
                      </svg>
                    </button>
                    {isAdmin && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(game.id)}>Obriši</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #1e1e1e" }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{ background: "transparent", border: "1px solid #2a2a2a", color: currentPage === 1 ? "#333" : "#a0a0a0", padding: "6px 12px", borderRadius: "4px", cursor: currentPage === 1 ? "default" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>
              ← Prethodna
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)}
                style={{ background: page === currentPage ? "#f59e0b" : "transparent", border: "1px solid", borderColor: page === currentPage ? "#f59e0b" : "#2a2a2a", color: page === currentPage ? "#111" : "#a0a0a0", width: "34px", height: "34px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: page === currentPage ? "700" : "400", fontFamily: "inherit" }}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{ background: "transparent", border: "1px solid #2a2a2a", color: currentPage === totalPages ? "#333" : "#a0a0a0", padding: "6px 12px", borderRadius: "4px", cursor: currentPage === totalPages ? "default" : "pointer", fontSize: "13px", fontFamily: "inherit" }}>
              Sljedeća →
            </button>
          </div>
        )}
      </main>

      {selectedGame && (
        <RatingModal game={selectedGame} currentUser={currentUser} onClose={() => setSelectedGame(null)} />
      )}
    </>
  );
}

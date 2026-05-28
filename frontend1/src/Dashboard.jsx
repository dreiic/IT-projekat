import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RatingModal from "./RatingModal";
import EditProfileModal from "./EditProfileModal";
import WishlistModal from "./WishlistModal";
import "./App.css";

export default function Dashboard({ currentUser, token, onLogout }) {
  const [games, setGames] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [newGame, setNewGame] = useState({
    naziv: "",
    zanr: "",
    slika_url: "",
    kupi_url: ""
  });

  // Filter i sortiranje
  const [filterGenre, setFilterGenre] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Dinamički žanrovi
  const [filterGenreOptions, setFilterGenreOptions] = useState([]);

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
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (navSearchRef.current && !navSearchRef.current.contains(e.target)) {
        setNavSearch("");
      }
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
    if (userSearch.trim() === "") { setUserSearchResults([]); return; }
    const t = setTimeout(() => {
      fetch(`http://localhost:5001/api/users/search?q=${encodeURIComponent(userSearch)}`)
        .then(r => r.json())
        .then(setUserSearchResults)
        .catch(() => setUserSearchResults([]));
    }, 250);
    return () => clearTimeout(t);
  }, [userSearch]);

  const navigate = useNavigate();
  const isAdmin = currentUser?.email === "dreicedis@gmail.com";

  // Učitaj igre i wishlist
  useEffect(() => {
    fetch("http://localhost:5001/api/games")
      .then((r) => r.json())
      .then(async (data) => {
        const gamesWithAvg = await Promise.all(
          data.map(async (g) => {
            try {
              const res = await fetch(`http://localhost:5001/api/games/${g.id}/ratings`);
              if (!res.ok) return { ...g, average: 0 };
              const ratings = await res.json();
              let avg = 0;
              if (ratings.length > 0) {
                avg = ratings.reduce((sum, r) => sum + r.ocjena, 0) / ratings.length;
              }
              return { ...g, average: avg };
            } catch {
              return { ...g, average: 0 };
            }
          })
        );
        setGames(gamesWithAvg);
      });

    fetch(`http://localhost:5001/api/wishlist/${currentUser.id}`)
      .then(r => r.json())
      .then(setWishlist);
  }, [currentUser.id]);

  // Učitaj dinamičke žanrove iz backend-a
  useEffect(() => {
    fetch("http://localhost:5001/api/games/genres")
      .then(res => res.json())
      .then(setFilterGenreOptions)
      .catch(() => setFilterGenreOptions([]));
  }, []);

  const navSearchResults = navSearch.trim().length > 0
    ? games.filter(g => g.naziv.toLowerCase().includes(navSearch.toLowerCase())).slice(0, 6)
    : [];


  const handleDelete = async (id) => {
    if (!window.confirm("Obrisati igru?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/games/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setGames((g) => g.filter((x) => x.id !== id));
    } catch {
      alert("Greška kod brisanja");
    }
  };

  async function handleWishlistToggle(igra_id, inWishlist) {
    if (inWishlist) {
      await fetch("http://localhost:5001/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ korisnik_id: currentUser.id, igra_id })
      });
      setWishlist(wishlist => wishlist.filter(w => w.id !== igra_id));
    } else {
      await fetch("http://localhost:5001/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ korisnik_id: currentUser.id, igra_id })
      });
      const wl = await fetch(`http://localhost:5001/api/wishlist/${currentUser.id}`).then(r => r.json());
      setWishlist(wl);
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const GAMES_PER_PAGE = 15;

  // Filtriranje i sortiranje igara
  const filteredAndSortedGames = games
    .filter(game => filterGenre ? game.zanr === filterGenre : true)
    .sort((a, b) => {
      if (sortBy === "rating_desc") return (b.average || 0) - (a.average || 0);
      if (sortBy === "rating_asc") return (a.average || 0) - (b.average || 0);
      if (sortBy === "naziv_asc") return a.naziv.localeCompare(b.naziv);
      if (sortBy === "naziv_desc") return b.naziv.localeCompare(a.naziv);
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedGames.length / GAMES_PER_PAGE);
  const paginatedGames = filteredAndSortedGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  function renderStars(avg = 0) {
    const rounded = Math.round(avg || 0);
    return (
      <div className="stars-row">
        {[1, 2, 3, 4, 5].map(i => (
          <i
            key={i}
            className={i <= rounded ? "fas fa-star star-filled" : "far fa-star star-empty"}
          />
        ))}
        <span className="stars-avg">{avg ? avg.toFixed(1) : "N/A"}</span>
      </div>
    );
  }

  function updateProfileLocal(updated) {
    Object.assign(currentUser, updated);
    localStorage.setItem("korisnik", JSON.stringify(currentUser));
    setShowEdit(false);
    window.location.reload();
  }

  return (
    <>
      <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <a href="/" className="logo" style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "800",
          letterSpacing: "-0.02em"
        }}>
          <i className="fas fa-gamepad" style={{ marginRight: "8px" }}></i>
          GameRate
        </a>

        {/* Brza pretraga igara */}
        <div ref={navSearchRef} style={{ position: "relative", flex: "0 0 auto" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <svg style={{ position: "absolute", left: "10px", color: "#555", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Pretraži igre..."
              value={navSearch}
              onChange={e => setNavSearch(e.target.value)}
              style={{
                padding: "7px 14px 7px 32px",
                fontSize: "13px",
                borderRadius: "4px",
                border: "1px solid #2a2a2a",
                width: "260px",
                outline: "none",
                backgroundColor: "#1a1a1a",
                color: "#e0e0e0"
              }}
            />
          </div>

          {navSearch.trim().length > 0 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "4px",
              zIndex: 1000,
              overflow: "hidden"
            }}>
              {navSearchResults.length === 0 ? (
                <div style={{ padding: "12px 14px", fontSize: "13px", color: "#555" }}>
                  Nema rezultata
                </div>
              ) : (
                navSearchResults.map(game => (
                  <div
                    key={game.id}
                    onClick={() => { navigate(`/game/${game.id}`); setNavSearch(""); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #1e1e1e",
                      transition: "background 0.12s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={game.slika_url}
                      alt={game.naziv}
                      style={{ width: "32px", height: "40px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{game.naziv}</div>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{game.zanr}</div>
                    </div>
                    {game.average > 0 && (
                      <div style={{ marginLeft: "auto", fontSize: "12px", color: "#f59e0b", flexShrink: 0 }}>
                        ★ {game.average.toFixed(1)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Navbar right: wishlist + user */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>

        {/* Wishlist */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowWishlist(true)}
            title="Wishlist"
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#a0a0a0",
              padding: "9px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s ease, color 0.15s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#e0e0e0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#a0a0a0"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
            </svg>
          </button>
          {wishlist.length > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#f59e0b",
              color: "#111",
              fontSize: "10px",
              fontWeight: "700",
              borderRadius: "10px",
              padding: "2px 5px",
              lineHeight: 1.3,
              minWidth: "18px",
              textAlign: "center",
              pointerEvents: "none"
            }}>
              {wishlist.length}
            </span>
          )}
        </div>

        {/* User search */}
        <div ref={userSearchRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setShowUserSearch(v => !v); setUserSearch(""); setUserSearchResults([]); }}
            title="Pretraži korisnike"
            style={{
              background: showUserSearch ? "#1a1a1a" : "transparent",
              border: "1px solid",
              borderColor: showUserSearch ? "#333" : "#1e1e1e",
              color: showUserSearch ? "#e0e0e0" : "#555",
              padding: "6px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "all 0.15s ease"
            }}
            onMouseEnter={e => { if (!showUserSearch) { e.currentTarget.style.color = "#e0e0e0"; e.currentTarget.style.borderColor = "#333"; } }}
            onMouseLeave={e => { if (!showUserSearch) { e.currentTarget.style.color = "#555"; e.currentTarget.style.borderColor = "#1e1e1e"; } }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.1992 12C14.9606 12 17.1992 9.76142 17.1992 7C17.1992 4.23858 14.9606 2 12.1992 2C9.43779 2 7.19922 4.23858 7.19922 7C7.19922 9.76142 9.43779 12 12.1992 12Z"/>
              <path d="M3 22C3.57038 20.0332 4.74795 18.2971 6.36438 17.0399C7.98081 15.7827 9.95335 15.0687 12 15"/>
              <path d="M18.3795 20.8199C20.2793 20.8199 21.8195 19.2798 21.8195 17.3799C21.8195 15.4801 20.2793 13.9399 18.3795 13.9399C16.4796 13.9399 14.9395 15.4801 14.9395 17.3799C14.9395 19.2798 16.4796 20.8199 18.3795 20.8199Z"/>
              <path d="M22.9406 21.9401L20.8105 19.8101"/>
            </svg>
          </button>

          {showUserSearch && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              width: "280px",
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              zIndex: 300,
              overflow: "hidden"
            }}>
              <div style={{ padding: "10px" }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Pretraži korisnike..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
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

              {userSearchResults.length > 0 ? (
                userSearchResults.map(u => (
                  <div
                    key={u.id}
                    onClick={() => { navigate(`/user/${u.id}`); setShowUserSearch(false); setUserSearch(""); setUserSearchResults([]); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 12px",
                      cursor: "pointer",
                      borderTop: "1px solid #1e1e1e",
                      transition: "background 0.12s ease"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1a1a1a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <img
                      src={u.profilna_url || `https://ui-avatars.com/api/?name=${u.ime}&size=32&background=1a1a1a&color=e0e0e0`}
                      alt={u.ime}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>{u.ime} {u.prezime}</div>
                      <div style={{ fontSize: "11px", color: "#555" }}>{u.email}</div>
                    </div>
                  </div>
                ))
              ) : userSearch.trim().length > 0 ? (
                <div style={{ padding: "12px", fontSize: "13px", color: "#555", borderTop: "1px solid #1e1e1e" }}>
                  Nema rezultata
                </div>
              ) : (
                <div style={{ padding: "12px", fontSize: "12px", color: "#333", borderTop: "1px solid #1e1e1e" }}>
                  Ukucaj ime ili email korisnika
                </div>
              )}
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div ref={userMenuRef} style={{ position: "relative" }}>
          {/* Trigger */}
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: showUserMenu ? "#1a1a1a" : "transparent",
              border: "1px solid",
              borderColor: showUserMenu ? "#333" : "transparent",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer",
              transition: "background 0.15s ease, border-color 0.15s ease"
            }}
            onMouseEnter={e => { if (!showUserMenu) { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.borderColor = "#2a2a2a"; } }}
            onMouseLeave={e => { if (!showUserMenu) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
          >
            <img
              src={currentUser.profilna_url || "https://ui-avatars.com/api/?name=" + currentUser.ime}
              alt="profilna"
              style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
            />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>
              {currentUser.ime}
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              minWidth: "200px",
              zIndex: 500,
              overflow: "hidden"
            }}>
              {/* User info header */}
              <div style={{
                padding: "12px 14px",
                borderBottom: "1px solid #222",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <img
                  src={currentUser.profilna_url || "https://ui-avatars.com/api/?name=" + currentUser.ime}
                  alt="profilna"
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#e0e0e0" }}>
                    {currentUser.ime} {currentUser.prezime}
                  </div>
                  <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              {[
                {
                  label: "Uredi profil",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  ),
                  onClick: () => { setShowEdit(true); setShowUserMenu(false); },
                  danger: false
                },
                {
                  label: "Wishlist",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
                    </svg>
                  ),
                  onClick: () => { setShowWishlist(true); setShowUserMenu(false); },
                  danger: false
                },
                {
                  label: "Odjavi se",
                  icon: (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                  ),
                  onClick: onLogout,
                  danger: true
                }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: item.danger ? "#ef4444" : "#a0a0a0",
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s ease, color 0.12s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = item.danger ? "rgba(239,68,68,0.08)" : "#1a1a1a";
                    e.currentTarget.style.color = item.danger ? "#f87171" : "#e0e0e0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = item.danger ? "#ef4444" : "#a0a0a0";
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        </div> {/* end navbar right */}
      </div> {/* end header-inner */}
      </header>

      {showEdit && (
        <EditProfileModal
          currentUser={currentUser}
          token={token}
          onClose={() => setShowEdit(false)}
          onProfileUpdate={updateProfileLocal}
        />
      )}

      {showWishlist && (
        <WishlistModal
          wishlist={wishlist}
          onClose={() => setShowWishlist(false)}
          navigate={navigate}
        />
      )}

      <main style={{ padding: "28px 32px", paddingTop: "88px" }}>
        {/* Welcome + Toolbar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid #1e1e1e",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <p style={{ margin: 0, color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
              Dobrodošli nazad
            </p>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", color: "#fff" }}>
              {currentUser.ime} {currentUser.prezime} <span className="wave">👋</span>
            </h2>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={filterGenre}
            onChange={e => { setFilterGenre(e.target.value); setCurrentPage(1); }}
            style={{
              padding: "7px 10px",
              borderRadius: "4px",
              border: "1px solid #2a2a2a",
              fontSize: "13px",
              background: "#1a1a1a",
              color: "#a0a0a0"
            }}
          >
            <option value="">Svi žanrovi</option>
            {filterGenreOptions.map(zanr => (
              <option key={zanr} value={zanr}>{zanr}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            style={{
              padding: "7px 10px",
              borderRadius: "4px",
              border: "1px solid #2a2a2a",
              fontSize: "13px",
              background: "#1a1a1a",
              color: "#a0a0a0"
            }}
          >
            <option value="">Sortiraj po</option>
            <option value="rating_desc">Ocjena ↓</option>
            <option value="rating_asc">Ocjena ↑</option>
            <option value="naziv_asc">Naziv A–Z</option>
            <option value="naziv_desc">Naziv Z–A</option>
          </select>

          </div> {/* end filters */}
        </div> {/* end welcome+toolbar row */}

        {isAdmin && (
          <div style={{ marginBottom: "20px" }}>
            <button
              onClick={() => navigate("/add-game")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#f59e0b",
                color: "#111",
                border: "none",
                padding: "9px 18px",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s ease"
              }}
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
          {paginatedGames.map((game) => {
            const inWishlist = wishlist.some(w => w.id === game.id);
            return (
              <div key={game.id} className="game-card-new">
                <div className="game-img-container" onClick={() => navigate(`/game/${game.id}`)}>
                  <img src={game.slika_url} alt={game.naziv} className="game-cover-new" />
                </div>
                <div className="game-body-new">
                  <h3>{game.naziv}</h3>
                  <span className="game-genre-new">{game.zanr}</span>
                  <div className="game-rating-row">
                    {renderStars(game.average)}
                  </div>
                  <div className="game-meta-new">
                    <button
                      className="btn-rate"
                      onClick={() => setSelectedGame(game)}
                    >
                      Ocijeni
                    </button>
                    <button
                      onClick={() => handleWishlistToggle(game.id, inWishlist)}
                      title={inWishlist ? "Ukloni iz wishliste" : "Dodaj u wishlistu"}
                      style={{
                        background: inWishlist ? "rgba(62, 207, 142, 0.08)" : "transparent",
                        border: `1px solid ${inWishlist ? "#3ecf8e" : "#2a2a2a"}`,
                        color: inWishlist ? "#3ecf8e" : "#555",
                        padding: "6px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.15s ease, border-color 0.15s ease"
                      }}
                    >
                      {inWishlist ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19,3H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14,10h-1V9c0-0.6-0.4-1-1-1s-1,0.4-1,1v1h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h1v1c0,0.6,0.4,1,1,1s1-0.4,1-1v-1h1c0.6,0,1-0.4,1-1S14.6,10,14,10z"/>
                          <path d="M19,3h-1H6H5C4.4,3,4,3.4,4,4s0.4,1,1,1v14.1c0,0.7,0.4,1.4,1.1,1.8c0.3,0.2,0.6,0.2,0.9,0.2c0.4,0,0.8-0.1,1.1-0.3l3.9-2.6l3.9,2.6c0.6,0.4,1.4,0.5,2.1,0.1c0.7-0.3,1.1-1,1.1-1.8V5c0.6,0,1-0.4,1-1S19.6,3,19,3z M17,19.1l-3.9-2.6c-0.3-0.2-0.7-0.3-1.1-0.3s-0.8,0.1-1.1,0.3L7,19.1V5h10V19.1z"/>
                        </svg>
                      )}
                    </button>
                    {isAdmin && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(game.id)}
                      >
                        Obriši
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #1e1e1e"
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                color: currentPage === 1 ? "#333" : "#a0a0a0",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: currentPage === 1 ? "default" : "pointer",
                fontSize: "13px",
                fontFamily: "inherit",
                transition: "color 0.15s ease, border-color 0.15s ease"
              }}
            >
              ← Prethodna
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  background: page === currentPage ? "#f59e0b" : "transparent",
                  border: "1px solid",
                  borderColor: page === currentPage ? "#f59e0b" : "#2a2a2a",
                  color: page === currentPage ? "#111" : "#a0a0a0",
                  width: "34px",
                  height: "34px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: page === currentPage ? "700" : "400",
                  fontFamily: "inherit",
                  transition: "all 0.15s ease"
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                color: currentPage === totalPages ? "#333" : "#a0a0a0",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: currentPage === totalPages ? "default" : "pointer",
                fontSize: "13px",
                fontFamily: "inherit",
                transition: "color 0.15s ease, border-color 0.15s ease"
              }}
            >
              Sljedeća →
            </button>
          </div>
        )}
      </main>

      {selectedGame && (
        <RatingModal
          game={selectedGame}
          currentUser={currentUser}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
}

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function AddGame() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fileInputRef = useRef(null);

  const [naziv, setNaziv] = useState("");
  const [zanr, setZanr] = useState("");
  const [kupiUrl, setKupiUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function onFileChange(e) {
    handleFile(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) { setError("Odaberi sliku igre."); return; }
    setError("");
    setLoading(true);

    try {
      // 1. Upload slike
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData
      });
      if (!uploadRes.ok) throw new Error("Greška pri uploadu slike.");
      const { url } = await uploadRes.json();
      const slikaUrl = `http://localhost:5001${url}`;

      // 2. Dodaj igru
      const gameRes = await fetch("http://localhost:5001/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ naziv, zanr, slika_url: slikaUrl, kupi_url: kupiUrl })
      });
      if (!gameRes.ok) throw new Error("Greška pri dodavanju igre.");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
        borderBottom: "1px solid #242424"
      }}>
        <a href="/" style={{ textDecoration: "none", color: "#fff", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="fas fa-gamepad"></i>
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

      <main style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ marginBottom: "28px" }}>
          <p style={{ margin: "0 0 4px 0", color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Admin</p>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em", color: "#fff" }}>Dodaj igru</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Naziv */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Naziv igre
            </label>
            <input
              type="text"
              value={naziv}
              onChange={e => setNaziv(e.target.value)}
              placeholder="npr. The Witcher 3"
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e0e0e0",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease"
              }}
              onFocus={e => e.target.style.borderColor = "#f59e0b"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          {/* Žanr */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Žanr
            </label>
            <input
              type="text"
              value={zanr}
              onChange={e => setZanr(e.target.value)}
              placeholder="npr. RPG, Action, Sports..."
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e0e0e0",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease"
              }}
              onFocus={e => e.target.style.borderColor = "#f59e0b"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          {/* URL za kupovinu */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Link za kupovinu
            </label>
            <input
              type="url"
              value={kupiUrl}
              onChange={e => setKupiUrl(e.target.value)}
              placeholder="https://store.steampowered.com/..."
              required
              style={{
                width: "100%",
                padding: "9px 12px",
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "4px",
                color: "#e0e0e0",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease"
              }}
              onFocus={e => e.target.style.borderColor = "#f59e0b"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
            />
          </div>

          {/* Upload slike */}
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#555", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Naslovna slika
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              style={{
                border: `2px dashed ${dragging ? "#f59e0b" : imageFile ? "#3ecf8e" : "#2a2a2a"}`,
                borderRadius: "6px",
                background: dragging ? "rgba(245,158,11,0.04)" : "#1a1a1a",
                cursor: "pointer",
                transition: "border-color 0.15s ease, background 0.15s ease",
                overflow: "hidden"
              }}
            >
              {imagePreview ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    padding: "8px 12px",
                    background: "rgba(0,0,0,0.7)",
                    fontSize: "12px",
                    color: "#a0a0a0"
                  }}>
                    {imageFile.name} · Klikni za promjenu
                  </div>
                </div>
              ) : (
                <div style={{ padding: "36px 20px", textAlign: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "10px" }}>
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#555" }}>Prevuci sliku ovdje ili klikni za odabir</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#333" }}>JPG, PNG, WEBP</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>

          {error && (
            <p style={{ margin: 0, color: "#ef4444", fontSize: "13px" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? "#555" : "#f59e0b",
              color: "#111",
              border: "none",
              padding: "11px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: loading ? "default" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s ease",
              marginTop: "4px"
            }}
          >
            {loading ? "Dodavanje..." : "Dodaj igru"}
          </button>

        </form>
      </main>
    </div>
  );
}

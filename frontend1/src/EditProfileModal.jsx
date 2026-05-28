import { useState } from "react";
import "./App.css";

export default function EditProfileModal({ currentUser, token, onClose, onProfileUpdate }) {
  const [ime, setIme] = useState(currentUser.ime || "");
  const [prezime, setPrezime] = useState(currentUser.prezime || "");
  const [profilna_url, setProfilna] = useState(currentUser.profilna_url || "");
  const [opis, setOpis] = useState(currentUser.opis || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Funkcija za upload fajla na backend
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProfilna(data.url);
    } catch {
      alert("Greška pri uploadu slike.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/users/${currentUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ime, prezime, profilna_url, opis }),
      });
      if (!res.ok) throw new Error();
      if (onProfileUpdate) onProfileUpdate({ ...currentUser, ime, prezime, profilna_url, opis });
      onClose();
    } catch {
      alert("Greška pri izmjeni profila.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <form className="edit-profile-modal" onSubmit={handleSubmit}>
        <h2>Izmeni profil</h2>
        <label>Ime</label>
        <input value={ime} onChange={e => setIme(e.target.value)} required />

        <label>Prezime</label>
        <input value={prezime} onChange={e => setPrezime(e.target.value)} />

        <label>Profilna slika (upload)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files.length > 0) uploadFile(e.target.files[0]);
          }}
          disabled={uploading}
        />
        {uploading && <p>Uploadujem sliku...</p>}

        {profilna_url && (
          <img
            src={profilna_url.startsWith("http") ? profilna_url : `http://localhost:5001${profilna_url}`}
            alt="Profilna"
            className="profile-preview"
            style={{ maxWidth: 80, borderRadius: "50%", marginTop: 10 }}
          />
        )}

        <label>Opis (biografija)</label>
        <textarea value={opis} onChange={e => setOpis(e.target.value)} rows={3} />

        <div className="modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose} disabled={loading || uploading}>
            Otkaži
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading || uploading}>
            Sačuvaj
          </button>
        </div>
      </form>
    </div>
  );
}

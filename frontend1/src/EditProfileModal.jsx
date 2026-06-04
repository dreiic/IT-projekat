import { useState } from "react";
import { useToast } from "./Toast";
import "./App.css";

const API = "http://localhost:5001";

export default function EditProfileModal({ currentUser, token, onClose, onProfileUpdate, onDelete }) {
  const toast = useToast();
  const [ime, setIme] = useState(currentUser.ime || "");
  const [prezime, setPrezime] = useState(currentUser.prezime || "");
  const [profilna_url, setProfilna] = useState(currentUser.profilna_url || "");
  const [opis, setOpis] = useState(currentUser.opis || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await fetch(`${API}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      setProfilna(data.url);
    } catch {
      toast("Greška pri uploadu slike.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ime, prezime, profilna_url, opis })
      });
      if (!res.ok) throw new Error();
      if (onProfileUpdate) onProfileUpdate({ ...currentUser, ime, prezime, profilna_url, opis });
      toast("Profil uspješno ažuriran!", "success");
      onClose();
    } catch {
      toast("Greška pri izmjeni profila.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch(`${API}/api/users/${currentUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem("token");
      localStorage.removeItem("korisnik");
      if (onDelete) onDelete();
    } catch {
      toast("Greška pri brisanju naloga.");
    }
  }

  return (
    <div className="modal-overlay">
      <form className="edit-profile-modal" onSubmit={handleSubmit}>
        <h2>Izmeni profil</h2>

        <label>Ime</label>
        <input value={ime} onChange={e => setIme(e.target.value)} required />

        <label>Prezime</label>
        <input value={prezime} onChange={e => setPrezime(e.target.value)} />

        <label>Profilna slika (upload)</label>
        <input type="file" accept="image/*" disabled={uploading}
          onChange={e => { if (e.target.files.length > 0) uploadFile(e.target.files[0]); }} />
        {uploading && <p>Uploadujem sliku...</p>}

        {profilna_url && (
          <img
            src={profilna_url.startsWith("http") ? profilna_url : `${API}${profilna_url}`}
            alt="Profilna"
            className="profile-preview"
            style={{ maxWidth: 80, borderRadius: "50%", marginTop: 10 }}
          />
        )}

        <label>Opis (biografija)</label>
        <textarea value={opis} onChange={e => setOpis(e.target.value)} rows={3} />

        <div className="modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose} disabled={loading || uploading}>Otkaži</button>
          <button className="btn btn-primary" type="submit" disabled={loading || uploading}>Sačuvaj</button>
        </div>

        <div style={{ marginTop: "24px", borderTop: "1px solid #2a2a2a", paddingTop: "16px" }}>
          {!showDelete ? (
            <button type="button" onClick={() => setShowDelete(true)}
              style={{ background: "none", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "4px", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>
              Obriši nalog
            </button>
          ) : (
            <div>
              <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "8px" }}>
                Ova radnja je nepovratna. Ukucaj <strong>DELETE</strong> da potvrdiš:
              </p>
              <input type="text" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE"
                style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ef4444", background: "#1a1a1a", color: "#fff", fontSize: "14px", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button type="button" onClick={() => { setShowDelete(false); setDeleteInput(""); }}
                  style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #555", background: "none", color: "#aaa", cursor: "pointer", fontSize: "13px" }}>
                  Otkaži
                </button>
                <button type="button" disabled={deleteInput !== "DELETE"} onClick={handleDelete}
                  style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "none", background: deleteInput === "DELETE" ? "#ef4444" : "#5a2020", color: "#fff", cursor: deleteInput === "DELETE" ? "pointer" : "not-allowed", fontSize: "13px" }}>
                  Potvrdi brisanje
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

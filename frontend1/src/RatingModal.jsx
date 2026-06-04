import { useState } from "react";
import { useToast } from "./Toast";
import "./App.css";

const API = "http://localhost:5001";

const phrases = ["Loše (1 zvjezdica)", "Ispod prosijeka (2 zvjezdice)", "Dobro (3 zvjezdice)", "Vrlo dobro (4 zvjezdice)", "Odlično (5 zvjezdica)"];

export default function RatingModal({ game, currentUser, onClose }) {
  const toast = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (selectedRating === 0) { toast("Molimo izaberite ocjenu!", "warning"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/games/${game.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ userId: currentUser.id, rating: selectedRating, comment })
      });
      if (!res.ok) { toast("Greška pri slanju ocjene."); return; }
      toast("Ocjena uspješno poslata!", "success");
      onClose();
    } catch {
      toast("Greška na serveru.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="rating-modal" style={{ opacity: 1, transform: "translateY(0)" }}>
        <div className="modal-header">
          <h3><i className="fas fa-star"></i> Ocijenite {game.naziv}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="rating-control">
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map(i => (
                <i key={i} className={i <= selectedRating ? "fas fa-star" : "far fa-star"}
                  onClick={() => setSelectedRating(i)} title={phrases[i - 1]}></i>
              ))}
            </div>
            <div className="rating-text">
              {selectedRating > 0 ? phrases[selectedRating - 1] : "Izaberite ocjenu od 1 do 5 zvjezdica"}
            </div>
          </div>

          <div className="comment-section">
            <label>Komentar (opciono)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)}
              placeholder="Šta vam se posebno svidjelo u ovoj igri?..."></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Otkaži</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            <i className="fas fa-paper-plane"></i> Pošalji ocenu
          </button>
        </div>
      </div>
    </div>
  );
}

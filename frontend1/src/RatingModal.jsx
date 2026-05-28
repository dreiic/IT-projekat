import { useState } from "react";
import "./App.css";

function RatingModal({ game, currentUser, onClose }) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const phrases = [
    "Loše (1 zvezdica)",
    "Ispod proseka (2 zvezdice)",
    "Dobro (3 zvezdice)",
    "Vrlo dobro (4 zvezdice)",
    "Odlično (5 zvezdica)"
  ];

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      alert("Molimo izaberite ocenu!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5001/api/games/${game.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          rating: selectedRating,
          comment
        })
      });

      if (!res.ok) {
        alert("Greška pri slanju ocjene.");
        return;
      }

      alert("Ocjena uspješno poslata!");
      onClose();
    } catch (err) {
      alert("Greška na serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="rating-modal" style={{ opacity: 1, transform: "translateY(0)" }}>
        <div className="modal-header">
          <h3><i className="fas fa-star"></i> Ocenite {game.title}</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="rating-control">
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map(i => (
                <i
                  key={i}
                  className={i <= selectedRating ? "fas fa-star" : "far fa-star"}
                  onClick={() => setSelectedRating(i)}
                  title={phrases[i - 1]}
                ></i>
              ))}
            </div>
            <div className="rating-text">
              {selectedRating > 0 ? phrases[selectedRating - 1] : "Izaberite ocenu od 1 do 5 zvezdica"}
            </div>
          </div>

          <div className="comment-section">
            <label>Komentar (opciono)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Šta vam se posebno svidjelo u ovoj igri?..."
            ></textarea>
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

export default RatingModal;

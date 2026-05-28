import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserWishlist({ korisnik }) {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!korisnik) {
      setWishlist([]);
      return;
    }
    fetch(`http://localhost:5001/api/users/${korisnik.id}/wishlist`)
      .then(res => res.json())
      .then(setWishlist);
  }, [korisnik]);

  if (!korisnik) return <p>Izaberi korisnika za pregled wishliste.</p>;
  if (wishlist.length === 0) return <p>{korisnik.ime} nema nijednu igru u wish listi.</p>;

  return (
    <div>
      <h3>Wishlist korisnika: {korisnik.ime} {korisnik.prezime}</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {wishlist.map(game => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            style={{ cursor: "pointer", width: "150px", border: "1px solid #ddd", borderRadius: "6px", padding: "8px" }}
          >
            <img src={game.slika_url} alt={game.naziv} style={{ width: "100%", borderRadius: "6px" }} />
            <div><b>{game.naziv}</b></div>
            <div style={{ fontSize: "0.9em", color: "#555" }}>{game.zanr}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";

export default function SearchUsers({ onSelectUser }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5001/api/users/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Greška pri pretrazi");
      const data = await res.json();
      setResults(data);
    } catch {
      alert("Greška prilikom pretrage korisnika");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Pretraži korisnike po imenu, prezimenu ili emailu"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSearch()}
        style={{ width: "300px", padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleSearch}>Pretraži</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map(user => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user)}
            style={{ cursor: "pointer", marginTop: "10px", borderBottom: "1px solid #ccc", paddingBottom: "6px" }}
          >
            <b>{user.ime} {user.prezime}</b> ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

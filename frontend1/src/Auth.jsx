import { useState } from "react";
import "./App.css";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!name || !email || !password) {
        alert("Popuni sva polja!");
        return;
      }
      if (password.length < 6) {
        alert("Lozinka mora imati bar 6 karaktera!");
        return;
      }

      const newUser = {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
      };
      alert("Uspješna registracija!");
      onLogin(newUser);
    } else {
      if (email === "test@example.com" && password === "123456") {
        const user = {
          id: 1,
          name: "Test Korisnik",
          email,
        };
        onLogin(user);
      } else {
        alert("Pogrešan email ili lozinka.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          <i className="fas fa-gamepad"></i> GameRate
        </h1>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Ime i prezime</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email adresa</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit">
            {isRegister ? "Registruj se" : "Prijavi se"}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? (
            <p>
              Već imate nalog?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(false); }}>
                Prijavite se
              </a>
            </p>
          ) : (
            <p>
              Nemate nalog?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(true); }}>
                Registrujte se
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;

import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";
import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import GameDetails from "./GameDetails";
import UserProfile from "./UserProfile";
import AddGame from "./AddGame";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser  = localStorage.getItem("korisnik");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div id="app">
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onLogin={(user, token) => {
                  setCurrentUser(user);
                  setToken(token);
                  localStorage.setItem("token", token);
                  localStorage.setItem("korisnik", JSON.stringify(user));
                  navigate("/dashboard");
                }}
                onSwitch={() => {
                  navigate("/register");
                }}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register
                onRegister={() => {
                  navigate("/");
                }}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard
                currentUser={currentUser}
                token={token}
                onLogout={() => {
                  setCurrentUser(null);
                  setToken(null);
                  localStorage.removeItem("token");
                  localStorage.removeItem("korisnik");
                  navigate("/");
                }}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/add-game" element={<AddGame />} />
      </Routes>
    </div>
  );
}

export default App;

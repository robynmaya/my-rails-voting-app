import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    fetch("/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      body: JSON.stringify({ email, zip })
    })
      .then((res) => {
        if (res.ok) {
          navigate("/vote");
        } else {
          return res.json().then((json) => {
            throw new Error(json.error || "Login failed");
          });
        }
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h1>Sign in to Vote</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Zip Code:</label><br />
          <input
            type="text"
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
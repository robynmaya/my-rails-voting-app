import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="login-page">
      <div className="login-card">
        <div className="login-container">
          <h1 className="login-heading">Sign in to Vote</h1>

          {error && (
            <div role="alert" className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field">
              <label htmlFor="email-input">
                Email<span aria-hidden="true">*</span>
              </label>
              <input
                id="email-input"
                name="email"
                type="email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
                className="login-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="login-field">
              <label htmlFor="password-input">
                Password<span aria-hidden="true">*</span>
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
              />
            </div>
            <div className="login-field">
              <label htmlFor="zip-input">
                Zip Code<span aria-hidden="true">*</span>
              </label>
              <input
                id="zip-input"
                name="zip"
                type="text"
                required
                aria-required="true"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="login-input"
                placeholder="12345"
                pattern="\d{5}"
                title="Five-digit ZIP code"
              />
            </div>

            <button type="submit" className="login-button">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;
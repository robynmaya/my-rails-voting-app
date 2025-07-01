import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/fetchJson";
import { useUser } from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    fetchJson("/login", {
      method: "POST",
      body: {
        email: email.trim().toLowerCase(),
        zip: zip.trim(),
        password: password.trim()
      }
    })
      .then((data) => {
        // Store the user data including voter_id and voting status
        login({
          voter_id: data.voter_id,
          email: email.trim().toLowerCase(),
          zip: zip.trim(),
          wrote_in: data.wrote_in,
          voted: data.voted
        });
        navigate("/vote");
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
                autoComplete="email"
                required
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
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
                autoComplete="postal-code"
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
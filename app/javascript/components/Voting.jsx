import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Voting() {
  const [candidates, setCandidates] = useState([]);
  const [newName, setNewName] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 1. Fetch candidate list on mount
  useEffect(() => {
    fetch("/api/v1/candidates", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setCandidates(data))
      .catch(() => {
        // If unauthorized, send back to login
        navigate("/");
      });
  }, [navigate]);

  // 2. Cast a vote for a given candidate
  const castVote = (candidateId) => {
    setError(null);
    fetch("/api/v1/votes", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      body: JSON.stringify({ candidate_id: candidateId })
    })
      .then((res) => {
        if (res.ok) {
          setHasVoted(true);
        } else {
          return res.json().then((json) => {
            throw new Error(json.error || "Vote failed");
          });
        }
      })
      .catch((err) => setError(err.message));
  };

  // 3. Write‐in a new candidate (and cast vote)
  const addCandidate = (e) => {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) return;

    fetch("/api/v1/candidates", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept":       "application/json"
      },
      body: JSON.stringify({ name: newName.trim() })
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            throw new Error(json.error || "Could not add candidate");
          });
        }
        return res.json();
      })
      .then((newCandidate) => {
        // Append the newly created candidate (with initial vote count)
        setCandidates((prev) => [...prev, newCandidate]);
        setHasVoted(true);
        setNewName("");
      })
      .catch((err) => setError(err.message));
  };

  // 4. If user already voted, show “Thank you” screen
  if (hasVoted) {
    return (
      <main className="voting-page">
        <div className="voting-card" aria-live="polite">
          <div className="voting-container">
            <h2 className="voting-thanks">Thank you for voting!</h2>
            <button
              className="voting-button"
              onClick={() => navigate("/results")}
            >
              View Results
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 5. Otherwise, render the voting form
  return (
    <main className="voting-page">
      <div className="voting-card">
        <div className="voting-container">
          <h1 className="voting-heading">Cast Your Vote</h1>

          {error && (
            <div role="alert" className="voting-error">
              {error}
            </div>
          )}

          <ul className="candidate-list" aria-label="List of candidates">
            {candidates.map((cand) => (
              <li key={cand.id} className="candidate-item">
                <span className="candidate-name">{cand.name}</span>
                <span className="candidate-votes">({cand.votes} votes)</span>
                <button
                  className="candidate-vote-btn"
                  onClick={() => castVote(cand.id)}
                >
                  Vote
                </button>
              </li>
            ))}
          </ul>

          <hr className="voting-divider" />

          <h2 className="voting-subheading">Write-in a New Candidate</h2>
          <form onSubmit={addCandidate} className="writein-form" noValidate>
            <label htmlFor="writein-input" className="visually-hidden">
              New candidate name
            </label>
            <input
              id="writein-input"
              type="text"
              placeholder="New candidate name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="writein-input"
              aria-required="true"
            />
            <button type="submit" className="writein-button">
              Add &amp; Vote
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Voting;
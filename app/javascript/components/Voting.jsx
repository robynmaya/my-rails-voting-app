import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Voting({ history }) {
  const [candidates, setCandidates] = useState([]);
  const [newName, setNewName] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // When the component mounts, fetch the current list of candidates
  useEffect(() => {
    fetch("/api/v1/candidates", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setCandidates(data))
      .catch(() => {
        // If not logged in (401/403), send back to "/"
        navigate("/");
      });
  }, [navigate]);

  const castVote = (candidateId) => {
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

  const addCandidate = (e) => {
    e.preventDefault();
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
        setCandidates((prev) => [...prev, newCandidate]);
        setHasVoted(true);
        setNewName("");
      })
      .catch((err) => setError(err.message));
  };

  if (hasVoted) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Thank you for voting!</h2>
        <button onClick={() => history.push("/results")}>
          View Results
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Cast Your Vote for Favorite Performer</h1>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <ul>
        {candidates.map((cand) => (
          <li key={cand.id} style={{ marginBottom: "0.5rem" }}>
            {cand.name} ({cand.votes} votes)
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => castVote(cand.id)}
            >
              Vote
            </button>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "2rem 0" }} />
      <h3>Write-in a new candidate</h3>
      <form onSubmit={addCandidate}>
        <input
          type="text"
          placeholder="New candidate name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: "70%", marginRight: "0.5rem" }}
        />
        <button type="submit">Add & Vote</button>
      </form>
    </div>
  );
}

export default Voting;
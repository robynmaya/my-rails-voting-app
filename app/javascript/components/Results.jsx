import React, { useState, useEffect } from "react";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/results.json", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch(() => alert("Could not fetch results"));
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h1>Results</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              Candidate
            </th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #ccc" }}>
              Votes
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, idx) => (
            <tr key={idx}>
              <td style={{ padding: "0.5rem 0" }}>{row.name}</td>
              <td
                style={{
                  padding: "0.5rem 0",
                  textAlign: "right"
                }}
              >
                {row.votes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Results;
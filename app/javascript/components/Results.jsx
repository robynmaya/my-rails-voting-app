import React, { useState, useEffect } from "react";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/results.json", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load results");
        return res.json();
      })
      .then((data) => setResults(data))
      .catch(() => alert("Could not fetch results"));
  }, []);

  return (
    <main className="results-page">
      <div className="results-card">
        <div className="results-container">
          <h1 className="results-heading">Voting Results</h1>

          <div className="results-table-wrapper" role="region" aria-labelledby="results-title">
            <table className="results-table">
              <caption id="results-title" className="visually-hidden">
                Candidate names and vote counts
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="results-th">Candidate</th>
                  <th scope="col" className="results-th results-th--right">Votes</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="results-td no-data">
                      No votes have been cast yet.
                    </td>
                  </tr>
                ) : (
                  results.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "results-tr" : "results-tr results-tr--alt"}>
                      <td className="results-td">{row.name}</td>
                      <td className="results-td results-td--right">{row.votes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Results;
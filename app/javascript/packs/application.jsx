/* eslint no-console:0 */
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider } from "../contexts/UserContext";
import Login  from "../components/Login";
import Voting from "../components/Voting";
import Results from "../components/Results";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/vote" element={<Voting />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
});
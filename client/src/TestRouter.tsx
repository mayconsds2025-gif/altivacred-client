import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

export default function TestRouter() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
        <nav style={{ background: "#0b1c3a", color: "white", padding: "1rem" }}>
          <Link to="/" style={{ color: "white", marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>🏠 Página Inicial</h1>} />
          <Route path="/login" element={<h1>🔐 Login</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

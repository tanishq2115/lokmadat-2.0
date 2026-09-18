"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMessage("लॉगिन अयशस्वी: " + error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <img
          src="/lokmadat-logo.png"
          alt="लोकमदत"
          className="login-logo"
        />

        <h1>न्यूजरूम लॉगिन</h1>

        <p>
          लोकमदत न्यूजरूममध्ये प्रवेश करण्यासाठी लॉगिन करा.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">ई-मेल</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="आपला ई-मेल"
            required
          />

          <label htmlFor="password">पासवर्ड</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="पासवर्ड"
            required
          />

          {message && (
            <div className="login-message">
              {message}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "लॉगिन करत आहे..." : "लॉगिन"}
          </button>
        </form>

        <a href="/">
          ← मुख्यपृष्ठावर जा
        </a>
      </div>
    </main>
  );
}

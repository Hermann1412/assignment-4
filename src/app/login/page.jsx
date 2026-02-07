"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/users");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <div
        style={{
          maxWidth: 400,
          margin: "0 auto",
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 30,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 24, textAlign: "center" }}>
          Login
        </h1>

        {error && (
          <div
            style={{
              color: "#d32f2f",
              marginBottom: 16,
              fontSize: 14,
              padding: 10,
              backgroundColor: "#ffebee",
              borderRadius: 4,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: loading ? "#ccc" : "#1e88e5",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 14, color: "#666" }}>
          Don't have an account? <a href="/signup" style={{ color: "#1e88e5", fontWeight: "bold", textDecoration: "none" }}>Sign up here</a>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          firstname,
          lastname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create account");
        setLoading(false);
        return;
      }

      // Redirect to login on success
      router.push("/login?message=Account created successfully. Please login.");
    } catch (err) {
      setError("Failed to create account: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "40px 20px",
        fontFamily: "Arial",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 10, textAlign: "center" }}>
        Create Account
      </h1>
      <p style={{ color: "#666", marginBottom: 24, textAlign: "center" }}>
        Sign up to get started
      </p>

      <form onSubmit={handleSignup} style={{ backgroundColor: "#f5f5f5", padding: 24, borderRadius: 8 }}>
        {error && (
          <div
            style={{
              color: "#d32f2f",
              marginBottom: 16,
              padding: 12,
              backgroundColor: "#ffebee",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Username
          </label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            First Name
          </label>
          <input
            type="text"
            placeholder="Your first name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Last Name
          </label>
          <input
            type="text"
            placeholder="Your last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
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
            backgroundColor: loading ? "#999" : "#43a047",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", color: "#666" }}>
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "#1e88e5", textDecoration: "none", fontWeight: "bold" }}
        >
          Login here
        </Link>
      </p>
    </main>
  );
}

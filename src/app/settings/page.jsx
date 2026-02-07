"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleUpdate(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    // Validate passwords match if provided
    if (password && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        firstname,
        lastname,
        email,
      };

      // Only include password if user provided one
      if (password) {
        updateData.password = password;
      }

      const res = await fetch(`/api/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to update profile");
        setLoading(false);
        return;
      }

      setSuccessMsg("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");

      // Refresh user data
      const profileRes = await fetch("/api/user/profile", {
        credentials: "include",
      });

      if (profileRes.ok) {
        const profile = await profileRes.json();
        // You would typically dispatch this to your auth context here
        // For now, just show success message
      }

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update profile: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return <main style={{ padding: 30 }}>Loading...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Account Settings</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>Update your profile information</p>

      <form onSubmit={handleUpdate} style={{ backgroundColor: "#f5f5f5", padding: 24, borderRadius: 8 }}>
        {errorMsg && (
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
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              color: "#2e7d32",
              marginBottom: 16,
              padding: 12,
              backgroundColor: "#e8f5e9",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {successMsg}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            First Name
          </label>
          <input
            type="text"
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
            Email
          </label>
          <input
            type="email"
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

        <div style={{ borderTop: "1px solid #ddd", paddingTop: 16, marginTop: 24, marginBottom: 24 }}></div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
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
            backgroundColor: loading ? "#999" : "#1e88e5",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            marginRight: 12,
          }}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/users")}
          style={{
            backgroundColor: "#9e9e9e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}

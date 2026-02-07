"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  async function addUser(e) {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, firstname, lastname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Failed to add user");
        setSubmitting(false);
        return;
      }
      // Refetch users to get full data
      await fetchUsers();
      setShowForm(false);
      setUsername("");
      setEmail("");
      setPassword("");
      setFirstname("");
      setLastname("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add user: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  }

  if (authLoading) {
    return <main style={{ padding: 30 }}>Loading...</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>User Management</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>Manage all users in the system</p>

      {loading && <p>Loading...</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((u) => (
          <li
            key={u._id}
            style={{
              marginBottom: 12,
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: u._id === user._id ? "#e8f5e9" : "#fff",
            }}
          >
            <div>
              <strong style={{ fontSize: 16 }}>
                {u.firstname} {u.lastname}
                {u._id === user._id && (
                  <span
                    style={{
                      marginLeft: 8,
                      padding: "2px 8px",
                      backgroundColor: "#4caf50",
                      color: "white",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    YOU
                  </span>
                )}
              </strong>
              <div style={{ color: "#555", fontSize: 14 }}>@{u.username}</div>
              <div style={{ color: "#555", fontSize: 14 }}>{u.email}</div>
              <div style={{ color: "#999", fontSize: 12 }}>Status: {u.status}</div>
            </div>

            {u._id !== user._id && (
              <button
                onClick={() => deleteUser(u._id)}
                style={{
                  backgroundColor: "#e53935",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                DELETE
              </button>
            )}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 24 }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: "#1e88e5",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + ADD NEW USER
          </button>
        )}

        {showForm && (
          <form onSubmit={addUser} style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
            {errorMsg && (
              <div style={{ width: "100%", color: "#d32f2f", marginBottom: 8, fontSize: 14 }}>
                {errorMsg}
              </div>
            )}
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: "1 1 150px" }}
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: "1 1 150px" }}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: "1 1 150px" }}
            />
            <input
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: "1 1 120px" }}
            />
            <input
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", flex: "1 1 120px" }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: "#43a047", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
            >
              {submitting ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setUsername("");
                setEmail("");
                setPassword("");
                setFirstname("");
                setLastname("");
                setErrorMsg("");
              }}
              style={{ backgroundColor: "#9e9e9e", color: "white", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

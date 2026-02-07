"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header style={{ padding: 16, borderBottom: "1px solid #eee", marginBottom: 12, backgroundColor: "#f5f5f5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1e88e5" }}>
            Home
          </Link>
          <Link href="/items" style={{ textDecoration: "none", color: "#1e88e5" }}>
            Items
          </Link>
          <Link href="/users" style={{ textDecoration: "none", color: "#1e88e5" }}>
            Users
          </Link>
        </nav>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {user ? (
            <>
              <span style={{ fontSize: 14, color: "#666" }}>
                Welcome, <strong>{user.firstname || user.email}</strong>
              </span>
              <Link href="/settings" style={{ textDecoration: "none", color: "#1e88e5", fontSize: 14, fontWeight: "500" }}>
                Settings
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#e53935",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" style={{ textDecoration: "none", color: "#1e88e5" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#1e88e5",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

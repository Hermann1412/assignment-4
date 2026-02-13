"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({});
  const [hasImage, setHasImage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  async function onUpdateImage() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/upload-profile-image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Image updated successfully.");
        fetchProfile();
      } else {
        alert("Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    }
  }

  async function fetchProfile() {
    const result = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (result.status === 401) {
      router.push("/login");
    } else {
      const data = await result.json();
      if (data.profileImage != null) {
        console.log("has image...");
        setHasImage(true);
      }
      console.log("data: ", data);
      setIsLoading(false);
      setData(data);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: 30, fontFamily: "Arial" }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 800, margin: "0 auto" }}>
      <h3 style={{ fontSize: 24, marginBottom: 20 }}>Profile...</h3>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 30 }}>
        {/* Profile Image Section */}
        <div style={{ backgroundColor: "#f5f5f5", padding: 20, borderRadius: 8, textAlign: "center" }}>
          <h3 style={{ marginBottom: 16, fontSize: 14 }}>Profile Picture</h3>

          {hasImage && data.profileImage ? (
            <img
              src={`${API_URL}${data.profileImage}`}
              alt="Profile"
              width="150"
              height="150"
              style={{
                borderRadius: 8,
                marginBottom: 16,
                border: "2px solid #ddd",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#e0e0e0",
                borderRadius: 8,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No image
            </div>
          )}

          <input
            type="file"
            id="profileImage"
            name="profileImage"
            ref={fileInputRef}
            style={{ display: "none" }}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#1e88e5",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Choose File
          </button>

          <button
            onClick={onUpdateImage}
            style={{
              width: "100%",
              padding: 10,
              backgroundColor: "#43a047",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Update Image
          </button>

          <p style={{ fontSize: 12, color: "#999", marginTop: 12 }}>
            Max size: 5MB. Allowed: JPG, PNG, GIF, WebP
          </p>
        </div>

        {/* Profile Information Section */}
        <div style={{ backgroundColor: "#f5f5f5", padding: 20, borderRadius: 8 }}>
          <h3 style={{ marginBottom: 16, fontSize: 14 }}>Profile Information</h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 12, color: "#666" }}>
              ID
            </label>
            <div style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
              backgroundColor: "#e8e8e8",
              color: "#666",
            }}>
              {data._id}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 12, color: "#666" }}>
              Email
            </label>
            <div style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}>
              {data.email}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 12, color: "#666" }}>
              First Name
            </label>
            <div style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}>
              {data.firstname}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 12, color: "#666" }}>
              Last Name
            </label>
            <div style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 14,
            }}>
              {data.lastname}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => router.push("/users")}
          style={{
            backgroundColor: "#9e9e9e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Back to Users
        </button>
      </div>
    </div>
  );
}

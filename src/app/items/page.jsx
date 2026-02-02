"use client";

import React, { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/item");
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/item/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  }

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addItem(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, price: Number(price) }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add item");
      }
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setShowForm(false);
      setName("");
      setCategory("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item: " + (err.message || err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: 30, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>Items</h1>

      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p>No items found.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              marginBottom: 15,
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div>
              <strong style={{ fontSize: 18 }}>{item.itemName}</strong>
              <div>
                {item.itemCategory} — {'$' + item.itemPrice}
              </div>
            </div>

            <button
              onClick={() => deleteItem(item._id)}
              style={{
                backgroundColor: "#e53935",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 30 }}>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: "#1e88e5",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + ADD NEW ITEM
          </button>
        )}

        {showForm && (
          <form
            onSubmit={addItem}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <input
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", width: 100 }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: "#43a047",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {submitting ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setName("");
                setCategory("");
                setPrice("");
              }}
              style={{
                backgroundColor: "#9e9e9e",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 6,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

import React, { useState } from "react";
import "../styles/productModal.css";
function AddCategoryModal({ onSuccess, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ name: false });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true });
    setError("");

    if (!name) return;

    setLoading(true);

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create category.");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-modal-overlay">
      <div className="product-modal-container">

        {/* Header */}
        <div className="product-modal-header">
          <h3>Add New Category</h3>
          <button className="product-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Category Name */}
          <div className="product-form-group">
            <label className="product-form-label">Category Name</label>
            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              className={`product-form-input ${touched.name && !name ? "input-error" : ""}`}
            />
            {touched.name && !name && (
              <span className="field-warning">Please fill in the missing field!</span>
            )}
          </div>

          {/* Description */}
          <div className="product-form-group">
            <label className="product-form-label">
              Description{" "}
              <span style={{ color: "#6b7280", fontWeight: "400", fontSize: "12px" }}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="product-form-input"
            />
          </div>

          {error && <p className="product-error">{error}</p>}

          {/* Actions */}
          <div className="product-modal-actions">
            <button
              type="button"
              className="product-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="product-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;
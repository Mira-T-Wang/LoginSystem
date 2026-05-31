import React, { useState } from "react";
import "../styles/modal.css";
function DeleteProductModal({ product, onSuccess, onClose }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Delete failed.");
      } else {
        onSuccess();
      }
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Delete Product</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="delete-warning">
          {product.image && (
            <img
              src={`http://localhost:5000/uploads/${product.image}`}
              alt={product.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid rgba(79, 70, 229, 0.3)",
                marginBottom: "8px",
              }}
            />
          )}
          <p className="delete-warning-icon">⚠️</p>
          <p className="delete-warning-text">
            Are you sure you want to delete this product?
          </p>
          <p className="delete-warning-email">{product.name}</p>
          <p className="delete-warning-note">
            This action cannot be undone.
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductModal;
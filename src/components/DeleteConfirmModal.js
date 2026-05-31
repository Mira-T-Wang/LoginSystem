import React, { useState } from "react";
import "../styles/modal.css";
function DeleteConfirmModal({ user, onSuccess, onClose }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/users/${user._id}`, {
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
          <h3>Delete Account</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="delete-warning">
          <p className="delete-warning-icon">⚠️</p>
          <p className="delete-warning-text">
            Are you sure you want to delete this account?
          </p>
          <p className="delete-warning-email">{user.email}</p>
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

export default DeleteConfirmModal;
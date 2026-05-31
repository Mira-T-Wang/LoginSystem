import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import "../styles/modal.css";
function EditUserModal({ user, onSuccess, onClose }) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password && password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password && password.length < 9) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const updateData = { email };
      if (password) updateData.password = password;

      const response = await fetch(`/api/auth/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Update failed.");
      } else {
        onSuccess(data.user);
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
          <h3>Edit Account</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <PasswordInput
              type="password"
              placeholder="Leave empty to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={false}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <PasswordInput
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={false}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
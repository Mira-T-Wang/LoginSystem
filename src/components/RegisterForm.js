import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import Toast from "./Toast";

function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: "", type: "" });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return showToast("Invalid email. Must include @ and .com");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 9) {
      return setError("Password must be at least 9 characters.");
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
      } else {
        onRegisterSuccess();
      }
    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={clearToast}
      />
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            className={touched.email && !email ? "input-error" : ""}
          />
          {touched.email && !email && (
            <span className="field-warning">Please fill in the missing field!</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <PasswordInput
            id="reg-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            className={touched.password && !password ? "input-error" : ""}  
          />
          {touched.password && !password &&(
<span className="field-warning">Please fill in the missing field!</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <PasswordInput
            id="reg-confirm-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            className={touched.confirmPassword && !confirmPassword ? "input-error" : ""}
          />
          {touched.confirmPassword && !confirmPassword &&(
            <span className="field-warning">Please fill in the missing field!</span>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}

export default RegisterForm;
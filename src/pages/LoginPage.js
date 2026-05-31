import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/login.css";

function LoginPage({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegisterSuccess = () => {
    setSuccessMessage("Account created successfully! Please sign in.");
    setIsRegistering(false);
  };
  
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="login-subtitle">
          {isRegistering ? "Register a new account" : "Sign in to your account"}
        </p>

        {successMessage && (
          <p className="success-message">{successMessage}</p>
        )}

        {isRegistering ? (
          <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
        ) : (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        )}

        <p className="toggle-text">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}
          <button
            className="toggle-button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setSuccessMessage("");
            }}
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
import React, { useState, useEffect, useRef } from "react";
import PasswordInput from "./PasswordInput";

const LOCKOUT_PREFIX = "loginLockout_";

const getLockedUntilKey = (email) =>
  `${LOCKOUT_PREFIX}${email.toLowerCase().trim()}`;

const getRemainingFromStorage = (email) => {
  if (!email) return { remaining: 0, isPermanentLock: false };
  const stored = localStorage.getItem(getLockedUntilKey(email));
  if (!stored) return { remaining: 0, isPermanentLock: false };

  try {
    const parsed = JSON.parse(stored);
    const remaining = Math.ceil((parsed.lockedUntil - Date.now()) / 1000);
    return {
      remaining: remaining > 0 ? remaining : 0,
      isPermanentLock: parsed.isPermanentLock || false,
    };
  } catch {
    return { remaining: 0, isPermanentLock: false };
  }
};

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [isPermanentLock, setIsPermanentLock] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const timerRef = useRef(null);

  // Load lockout state when email changes
  useEffect(() => {
    clearInterval(timerRef.current);
    setError("");
    setIsPermanentLock(false);

    if (!email) {
      setLockoutSeconds(0);
      return;
    }

    const { remaining, isPermanentLock: isPermLock } =
      getRemainingFromStorage(email);

    if (remaining > 0) {
      setLockoutSeconds(remaining);
      setIsPermanentLock(isPermLock);
      setError(
        isPermLock
          ? "Account locked for 24 hours. Contact admin if this is a mistake."
          : `Account locked. Please wait ${remaining} seconds before trying again.`
      );
    } else {
      setLockoutSeconds(0);
      localStorage.removeItem(getLockedUntilKey(email));
    }
  }, [email]);

  // Visual countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0 || isPermanentLock) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          localStorage.removeItem(getLockedUntilKey(email));
          setError("");
          setIsPermanentLock(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [lockoutSeconds > 0, isPermanentLock]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const applyServerLockout = (lockedUntil, remainingSeconds, isPermLock, emailAddress) => {
    // Store as JSON object with both timestamp and permanent flag
    localStorage.setItem(
      getLockedUntilKey(emailAddress),
      JSON.stringify({ lockedUntil, isPermanentLock: isPermLock })
    );
    setLockoutSeconds(remainingSeconds);
    setIsPermanentLock(isPermLock);
    setError(
      isPermLock
        ? "Account locked for 24 hours. Contact admin if this is a mistake."
        : `Too many failed attempts. Please wait ${remainingSeconds} seconds before trying again.`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email || !password) return;
    if (lockoutSeconds > 0 || isPermanentLock) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 429) {
        applyServerLockout(
          data.lockedUntil,
          data.remainingSeconds,
          data.isPermanentLock,
          email
        );
        return;
      }

      if (!response.ok) {
        const attemptsMessage = data.attemptsLeft
          ? ` ${data.attemptsLeft} attempt${
              data.attemptsLeft === 1 ? "" : "s"
            } remaining before lockout.`
          : "";
        setError(`${data.message}${attemptsMessage}`);
        return;
      }

      // Success — clear lockout state
      localStorage.removeItem(getLockedUntilKey(email));
      setLockoutSeconds(0);
      setIsPermanentLock(false);
      onLoginSuccess(data.user);

    } catch (err) {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0 || isPermanentLock;

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur("email")}
          className={touched.email && !email ? "input-error" : ""}
          disabled={isLocked}
        />
        {touched.email && !email && (
          <span className="field-warning">
            Please fill in the missing field!
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur("password")}
          inputClassName={
            touched.password && !password ? "input-error" : ""
          }
          disabled={isLocked}
        />
        {touched.password && !password && (
          <span className="field-warning">
            Please fill in the missing field!
          </span>
        )}
      </div>

      {error && (
        <p className={`error-message ${isLocked ? "lockout-message" : ""}`}>
          {isPermanentLock
            ? `🔒 ${error}`
            : isLocked
            ? `🔒 ${error} (${lockoutSeconds}s remaining)`
            : error}
        </p>
      )}

      <button
        type="submit"
        className="login-button"
        disabled={loading || isLocked}
      >
        {isPermanentLock
          ? "Account Locked — Contact Admin"
          : isLocked
          ? `Locked — wait ${lockoutSeconds}s`
          : loading
          ? "Signing in..."
          : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;
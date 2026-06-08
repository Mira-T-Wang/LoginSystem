import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in via cookie
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setLoggedInUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
  };

  //logout 
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setLoggedInUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedInUser
            ? <Navigate to="/dashboard" />
            : <LoginPage onLoginSuccess={handleLoginSuccess} />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          loggedInUser
            ? <DashboardPage user={loggedInUser} onLogout={handleLogout} onUserUpdate={handleLoginSuccess} />
            : <Navigate to="/login" />
        }
      />
      <Route
        path="*"
        element={<Navigate to={loggedInUser ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
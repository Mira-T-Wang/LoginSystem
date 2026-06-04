import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //check if a user was saved before 
  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

const handleLoginSuccess = (user) => {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
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
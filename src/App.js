import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          loggedInUser
            ? <Navigate to="/dashboard" />
            : <LoginPage onLoginSuccess={setLoggedInUser} />
        }
      />
      <Route
        path="/dashboard/*"
        element={
          loggedInUser
            ? <DashboardPage user={loggedInUser} onLogout={handleLogout} onUserUpdate={setLoggedInUser} />
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
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserTable from "../components/UserTable";
import NotificationBell from "../components/NotificationBell";
import DashboardHomePage from "./DashboardHomePage";
import OrdersPage from "./OrdersPage";
import ProductPage from "./ProductPage";
import CategoryPage from "./CategoryPage";
import ProfilePage from "./ProfilePage";
import BillingPage from "./BillingPage";
import NotificationsSettingsPage from "./NotificationsSettingsPage";
import "../styles/dashboard.css";

function DashboardPage({ user, onLogout, onUserUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/users");
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to load users.");
      } else {
        setUsers(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />
      <div className="dashboard-main">

        {/* Header */}
        <div className="dashboard-header">
          <p className="dashboard-welcome">Logged in as: {user.email}</p>
          <NotificationBell />
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<DashboardHomePage user={user} />} />
          <Route path="/orders" element={<OrdersPage user={user} />} />
          <Route path="/products" element={<ProductPage user={user} />} />
          <Route path="/category" element={<CategoryPage user={user} />} />
          <Route
            path="/users"
            element={
              loading ? (
                <p className="dashboard-loading">Loading users...</p>
              ) : error ? (
                <p className="dashboard-error">{error}</p>
              ) : (
                <UserTable
                  users={users}
                  currentUser={user}
                  onRefresh={fetchUsers}
                  onUserUpdate={onUserUpdate}
                  onLogout={onLogout}
                />
              )
            }
          />
          <Route path="/settings/profile" element={<ProfilePage user={user} />} />
          <Route path="/settings/billing" element={<BillingPage />} />
          <Route path="/settings/notifications" element={<NotificationsSettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default DashboardPage;
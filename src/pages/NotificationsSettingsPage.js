import React, { useState,useEffect } from "react";
import "../styles/settings.css";

function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newUsers: true,
    systemUpdates: false,
    weeklyReport: true,
  });

  const [loading, setLoading]=useState(true);
    useEffect(() => {
    fetch("http://localhost:5000/api/auth/notifications", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };

      fetch("http://localhost:5000/api/auth/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      return updated;
    });
  };

  const notificationItems = [

     {
      key: "newOrders",
      label: "New Orders",
      description: "Get notified when a new order is placed",
    }, 
    {
      key: "lowStock",
      label: "Low Stock Alerts",
      description: "Get notified when a product stock is running low",
      //icon: "📦",
    },
    {
      key: "newUsers",
      label: "New User Registrations",
      description: "Get notified when a new user registers",
      //icon: "👥",
    },
    {
      key: "systemUpdates",
      label: "System Updates",
      description: "Get notified about system maintenance and updates",
      //icon: "⚙️",
    },
    {
      key: "weeklyReport",
      label: "Weekly Report",
      description: "Receive a weekly summary of sales and activity",
      //icon: "📊",
    },
  ];

  const enabledCount = Object.values(notifications).filter(Boolean).length;

  if (loading) return <p className="dashboard-loading">Loading notification settings...</p>;

  return (
    <div className="settings-page">   
      <h2 className="settings-title">Notifications</h2>
      <p className="settings-subtitle">
        {enabledCount} of {notificationItems.length} notifications enabled
      </p>

      <div className="settings-card">
        <h3 className="settings-card-title">Notification Preferences</h3>
        <div className="notification-list">
          {notificationItems.map((item) => (
            <div key={item.key} className="notification-item">
              <div className="notification-item-left">
                <span className="notification-item-icon">{item.icon}</span>
                <div className="notification-item-info">
                  <span className="notification-item-label">{item.label}</span>
                  <span className="notification-item-desc">{item.description}</span>
                </div>
              </div>
              <button
                className={`toggle-switch ${notifications[item.key] ? "on" : "off"}`}
                onClick={() => handleToggle(item.key)}
                aria-label={`Toggle ${item.label}`}
              >
                <span className="toggle-knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationsSettingsPage;
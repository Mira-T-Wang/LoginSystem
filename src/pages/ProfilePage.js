import React from "react";
import "../styles/settings.css";

function ProfilePage({ user }) {
  return (
    <div className="settings-page">
      <h2 className="settings-title">Profile</h2>
      <p className="settings-subtitle">Your account information</p>

      <div className="settings-card">
        <div className="profile-avatar">
          <span className="profile-avatar-letter">
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="profile-info">
          <div className="profile-info-row">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{user.email}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Account ID</span>
            <span className="profile-info-value profile-id">{user.id}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    timeZone: "Asia/Yangon",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Account Status</span>
            <span className="profile-status-badge">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
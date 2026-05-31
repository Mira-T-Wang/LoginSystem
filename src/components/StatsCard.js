import React from "react";

function StatCard({ label, value, icon, type, prefix, suffix }) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className="stat-card-value">
        {prefix}{value}{suffix}
      </div>
      <div className="stat-card-sub">
        All time total
      </div>
    </div>
  );
}

export default StatCard;
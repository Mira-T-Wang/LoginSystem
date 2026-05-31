import React, { useState, useEffect } from "react";
import StatCard from "../components/StatsCard";
import SalesGraph from "../components/SalesGraph";
import "../styles/dashboardhome.css";

function DashboardHomePage({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      const data = await response.json();
      if (!response.ok) {
        setError("Failed to load stats.");
      } else {
        setStats(data);
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="stat-cards-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card-skeleton" />
          ))}
        </div>
        <div className="graph-skeleton" />
      </div>
    );
  }

  if (error) {
    return <p className="dashboard-error">{error}</p>;
  }

  return (
    <div className="dashboard-home">
      <div className="stat-cards-row">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          //icon="📦"
          type="products"
        />
        <StatCard
          label="Sold Products"
          value={stats.soldProducts}
          //icon="🛒"
          type="sold"
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          //icon="👥"
          type="users"
        />
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          //icon="💰"
          type="revenue"
        />
      </div>

      <SalesGraph graphData={stats.graphData} />
    </div>
  );
}

export default DashboardHomePage;
import React, { useState, useEffect } from "react";
import "../styles/settings.css";

function BillingPage() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/plan", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPlan(data.plan))
      .finally(() => setLoading(false));
  }, []);

  const handleUpgradeClick = () => {
    setNotice("Pro plan is not available in your region yet.");
    setTimeout(() => setNotice(""), 4000);
  };

  if (loading) return <p className="dashboard-loading">Loading billing...</p>;

  return (
    <div className="settings-page">
      <h2 className="settings-title">Billing</h2>
      <p className="settings-subtitle">Manage your subscription plan</p>

      {notice && (
        <div className="billing-notice">
          {notice}
        </div>
      )}

      {/* Current Plan */}
      <div className="settings-card">
        <h3 className="settings-card-title">Current Plan</h3>
        <div className="billing-plan-row">
          <div className="billing-plan-info">
            <span className="billing-plan-name">
              {plan === "pro" ? "Pro Plan" : "Free Plan"}
            </span>
            <span className="billing-plan-desc">
              {plan === "pro"
                ? "Full access to all features"
                : "Basic access with limited features"}
            </span>
          </div>
          <span className="billing-plan-badge">Active</span>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="billing-plans-grid">

        {/* Free Plan Card */}
        <div className={`billing-plan-card ${plan === "free" ? "billing-plan-current" : ""}`}>
          <div className="billing-plan-card-header">
            <h3>Free</h3>
            <span className="billing-plan-price">$0<span>/mo</span></span>
          </div>
          <ul className="billing-features-list">
            <li>Up to 50 products</li>
            <li>Up to 2 users</li>
            <li>Basic dashboard stats</li>
            <li>Order management</li>
          </ul>
          {plan === "free" && (
            <span className="billing-current-badge">Current Plan</span>
          )}
        </div>

        {/* Pro Plan Card */}
        <div className={`billing-plan-card billing-plan-pro ${plan === "pro" ? "billing-plan-current" : ""}`}>
          <div className="billing-plan-card-header">
            <h3>Pro</h3>
            <span className="billing-plan-price">$29<span>/mo</span></span>
          </div>
          <ul className="billing-features-list">
            <li>Unlimited products</li>
            <li>Unlimited users</li>
            <li>Advanced reports</li>
            <li>Priority support</li>
            <li>Export to CSV</li>
          </ul>
          {plan === "pro" ? (
            <span className="billing-current-badge">Current Plan</span>
          ) : (
            <button className="billing-upgrade-btn" onClick={handleUpgradeClick}>
              Upgrade to Pro
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default BillingPage;
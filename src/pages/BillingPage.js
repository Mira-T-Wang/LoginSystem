import React from "react";
import "../styles/settings.css";

function BillingPage() {
  return (
    <div className="settings-page">
      <h2 className="settings-title">Billing</h2>
      <p className="settings-subtitle">Manage your billing and subscription</p>

      <div className="settings-card">
        <div className="billing-placeholder">
          <span className="billing-icon"></span>
          <h3 className="billing-coming-soon">Page in progress.</h3>
          <p className="billing-description">
            Billing management will be available in a future update.
          </p>
        </div>
      </div>

      <div className="settings-card">
        <h3 className="settings-card-title">Current Plan</h3>
        <div className="billing-plan-row">
          <div className="billing-plan-info">
            <span className="billing-plan-name">Free Plan</span>
            <span className="billing-plan-desc">Basic access to all features</span>
          </div>
          <span className="billing-plan-badge">Active</span>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
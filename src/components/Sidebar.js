import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({
    sales: false,
    products: false,
    users: false,
    settings: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => location.pathname === path;
  const goTo = (path) => navigate(path);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h2 className="sidebar-logo">My Dashboard</h2>
        <nav className="sidebar-nav">
          <ul>

            {/* Dashboard */}
            <li
              className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => goTo("/dashboard")}
            >
              <span className="sidebar-icon"></span>
              Dashboard
            </li>

            {/* Sales */}
            <li
              className={`sidebar-item ${openMenus.sales ? "open" : ""}`}
              onClick={() => toggleMenu("sales")}
            >
              <span className="sidebar-icon"></span>
              Sales
              <span className="sidebar-arrow">{openMenus.sales ? "▾" : "▸"}</span>
            </li>
            {openMenus.sales && (
              <ul className="sidebar-submenu">
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/orders") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/orders")}
                >
                  Orders
                </li>
              </ul>
            )}

            {/* Product Management */}
            <li
              className={`sidebar-item ${openMenus.products ? "open" : ""}`}
              onClick={() => toggleMenu("products")}
            >
              <span className="sidebar-icon"></span>
              Product Management
              <span className="sidebar-arrow">{openMenus.products ? "▾" : "▸"}</span>
            </li>
            {openMenus.products && (
              <ul className="sidebar-submenu">
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/products") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/products")}
                >
                  Product
                </li>
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/category") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/category")}
                >
                  Category
                </li>
              </ul>
            )}

            {/* User Management */}
            <li
              className={`sidebar-item ${openMenus.users ? "open" : ""}`}
              onClick={() => toggleMenu("users")}
            >
              <span className="sidebar-icon"></span>
              User Management
              <span className="sidebar-arrow">{openMenus.users ? "▾" : "▸"}</span>
            </li>
            {openMenus.users && (
              <ul className="sidebar-submenu">
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/users") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/users")}
                >
                  Users List
                </li>
              </ul>
            )}

            {/* Settings */}
            <li
              className={`sidebar-item ${openMenus.settings ? "open" : ""}`}
              onClick={() => toggleMenu("settings")}
            >
              <span className="sidebar-icon"></span>
              Settings
              <span className="sidebar-arrow">{openMenus.settings ? "▾" : "▸"}</span>
            </li>
            {openMenus.settings && (
              <ul className="sidebar-submenu">
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/settings/profile") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/settings/profile")}
                >
                  Profile
                </li>
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/settings/billing") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/settings/billing")}
                >
                  Billing
                </li>
                <li
                  className={`sidebar-subitem ${isActive("/dashboard/settings/notifications") ? "active" : ""}`}
                  onClick={() => goTo("/dashboard/settings/notifications")}
                >
                  Notifications
                </li>
              </ul>
            )}

          </ul>
        </nav>
      </div>
      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={onLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
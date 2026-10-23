import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = ({ user, onLogout }) => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const username = user?.username || "Trader";
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="menu-container" style={{ position: "relative" }}>
      <img src="logo.png" alt="StockPilot" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
              onClick={() => handleMenuClick(6)}
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div
          className="profile"
          onClick={handleProfileClick}
          style={{ position: "relative", cursor: "pointer" }}
        >
          <div className="avatar">{initials}</div>
          <p className="username">{username}</p>
        </div>

        {isProfileDropdownOpen && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "55px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              borderRadius: "4px",
              padding: "15px",
              zIndex: 1000,
              minWidth: "200px",
              textAlign: "left",
              border: "1px solid #eaeaea",
            }}
          >
            <div style={{ marginBottom: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "#333" }}>{username}</div>
              <div style={{ fontSize: "0.8rem", color: "#777" }}>{user?.email || ""}</div>
            </div>
            <a
              href="/"
              style={{
                display: "block",
                padding: "6px 0",
                fontSize: "0.85rem",
                color: "#387ed1",
                textDecoration: "none",
              }}
            >
              ← Back to Main Website
            </a>
            <button
              onClick={onLogout}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "8px 12px",
                backgroundColor: "#df514c",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.85rem",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;

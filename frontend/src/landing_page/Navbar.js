import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Navbar() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("stockpilot_token");
    const savedUser = localStorage.getItem("stockpilot_user");
    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stockpilot_token");
    localStorage.removeItem("stockpilot_user");
    setToken(null);
    setUser(null);
    window.location.reload();
  };

  const getDashboardLink = () => {
    if (!token) return DASHBOARD_URL;
    return `${DASHBOARD_URL}/?token=${token}&user=${encodeURIComponent(
      JSON.stringify(user || {})
    )}`;
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom" style={{ backgroundColor: "#FFF" }}>
      <div className="container p-2">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="/media/logo4.png"
            alt="StockPilot"
            className="nav_logo"
            style={{ width: "25%" }}
          />
        </Link>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarMenu">
          <div className="d-flex ms-auto" role="search">
            <ul className="navbar-nav me-4 align-items-center">
              <li className="nav-item">
                <Link className="nav-link active" to="/about">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/product">
                  Product
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/pricing">
                  Pricing
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/support">
                  Support
                </Link>
              </li>

              {token ? (
                <>
                  <li className="nav-item">
                    <a
                      className="btn btn-outline-primary btn-sm mx-2"
                      href={getDashboardLink()}
                      style={{ fontWeight: "500" }}
                    >
                      Trading Dashboard →
                    </a>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      className="btn btn-link nav-link active text-danger"
                      onClick={handleLogout}
                      style={{ textDecoration: "none" }}
                    >
                      Logout ({user?.username || "Account"})
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* <li className="nav-item">
                    <Link className="nav-link active" to="/login">
                      Login
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <button style={{ backgroundColor: "#387ed1", borderColor: "#387ed1", borderRadius:"10px"}}>
                    <Link
                      className="btn btn-primary btn-sm ms-2 px-3 text-white"
                      to="/signup"
                      style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                    >
                      Sign up
                    </Link>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

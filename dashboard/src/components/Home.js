import React, { useEffect, useState } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for token in URL query params (redirect from frontend)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const userParam = urlParams.get("user");

    if (tokenParam) {
      localStorage.setItem("stockpilot_token", tokenParam);
      if (userParam) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem("stockpilot_user", JSON.stringify(parsedUser));
        } catch (e) {
          // ignore parsing error
        }
      }
      // Remove token query string from address bar for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Retrieve token from localStorage
    const token = localStorage.getItem("stockpilot_token");

    if (!token) {
      // Redirect to frontend landing page if no token is present
      window.location.href = FRONTEND_URL;
      return;
    }

    // 3. Verify token with backend
    axios
      .get(`${BACKEND_URL}/verifyUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem("stockpilot_user", JSON.stringify(res.data.user));
          setLoading(false);
        } else {
          throw new Error("Verification failed");
        }
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        localStorage.removeItem("stockpilot_token");
        localStorage.removeItem("stockpilot_user");
        window.location.href = FRONTEND_URL;
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stockpilot_token");
    localStorage.removeItem("stockpilot_user");
    window.location.href = FRONTEND_URL;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
          color: "#424242",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #387ed1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "16px",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h3>Authenticating StockPilot Terminal...</h3>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>Connecting your secure trading session</p>
      </div>
    );
  }

  return (
    <>
      <TopBar user={user} onLogout={handleLogout} />
      <Dashboard user={user} />
    </>
  );
};

export default Home;

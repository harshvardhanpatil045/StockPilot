import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const DASHBOARD_URL = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Signup({ defaultMode = "signup" }) {
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    identifier: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
  };

  const handleToggleMode = (mode) => {
    setIsLogin(mode === "login");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (isLogin) {
      // Login validation
      if (!formData.identifier.trim()) {
        setErrorMessage("Please enter your email or username.");
        return;
      }
      if (!formData.password) {
        setErrorMessage("Please enter your password.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${BACKEND_URL}/login`, {
          identifier: formData.identifier.trim(),
          password: formData.password,
        });

        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem("stockpilot_token", token);
          localStorage.setItem("stockpilot_user", JSON.stringify(user));
          setSuccessMessage("Login successful! Redirecting to your dashboard...");

          
setTimeout(() => {
  window.location.href = "/dashboard/";
}, 800);

        }
      } catch (err) {
        console.error("Login error:", err);
        if (!err.response) {
          setErrorMessage(
            `Cannot connect to backend server at ${BACKEND_URL}. Please ensure the backend is running on port 3002.`
          );
        } else {
          setErrorMessage(
            err.response?.data?.message || "Invalid credentials. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      // Signup validation
      if (!formData.username.trim() || formData.username.trim().length < 3) {
        setErrorMessage("Username must be at least 3 characters long.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${BACKEND_URL}/signup`, {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem("stockpilot_token", token);
          localStorage.setItem("stockpilot_user", JSON.stringify(user));
          setSuccessMessage("Account created successfully! Launching trading terminal...");

          
setTimeout(() => {
  window.location.href = "/dashboard/";
}, 1000);

        }
      } catch (err) {
        console.error("Signup error:", err);
        if (!err.response) {
          setErrorMessage(
            `Cannot connect to backend server at ${BACKEND_URL}. Please ensure the backend is running on port 3002.`
          );
        } else {
          setErrorMessage(
            err.response?.data?.message || "Failed to create account. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center justify-content-center my-4">
        {/* Left Side: Illustration */}
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
          <img
            src="/media/signup.png"
            alt="StockPilot Open Account"
            className="img-fluid"
            style={{ maxHeight: "380px" }}
          />
          <h4 className="mt-4 text-muted" style={{ fontWeight: 400 }}>
            Modern investment &amp; trading platform
          </h4>
          <p className="text-secondary small">
            Start investing with zero brokerage on equity delivery.
          </p>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="col-12 col-md-5">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "8px" }}>
            {/* Mode Switcher */}
            <div className="d-flex mb-4 border-bottom pb-2">
              <button
                type="button"
                className={`btn flex-fill text-center pb-2 ${
                  !isLogin
                    ? "text-primary fw-bold border-bottom border-primary border-3"
                    : "text-muted"
                }`}
                style={{ borderRadius: 0, border: "none", background: "none" }}
                onClick={() => handleToggleMode("signup")}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={`btn flex-fill text-center pb-2 ${
                  isLogin
                    ? "text-primary fw-bold border-bottom border-primary border-3"
                    : "text-muted"
                }`}
                style={{ borderRadius: 0, border: "none", background: "none" }}
                onClick={() => handleToggleMode("login")}
              >
                Log In
              </button>
            </div>

            <h3 className="mb-3 text-dark" style={{ fontWeight: 500 }}>
              {isLogin ? "Welcome back" : "Open a free demat account"}
            </h3>
            <p className="text-muted small mb-4">
              {isLogin
                ? "Log in to access your StockPilot trading dashboard."
                : "Or track your investments and manage your portfolio with ease."}
            </p>

            {errorMessage && (
              <div className="alert alert-danger py-2 small" role="alert">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success py-2 small" role="alert">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isLogin ? (
                // LOGIN FIELDS
                <>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      className="form-control"
                      placeholder="e.g. user@example.com or harsh"
                      value={formData.identifier}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              ) : (
                // SIGNUP FIELDS
                <>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="e.g. harsh_patil"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 mt-2"
                style={{ backgroundColor: "#387ed1", borderColor: "#387ed1" }}
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {isLogin ? "Logging in..." : "Creating Account..."}
                  </span>
                ) : isLogin ? (
                  "Log in to Dashboard"
                ) : (
                  "Continue to Dashboard"
                )}
              </button>
            </form>

            <div className="text-center mt-3 text-secondary small">
              {isLogin ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-primary"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleToggleMode("signup")}
                  >
                    Sign up now
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-primary"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleToggleMode("login")}
                  >
                    Log in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
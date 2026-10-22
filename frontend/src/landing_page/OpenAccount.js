import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5 text-center mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Open a StockPilot account</h1>
        <p>Modern platform and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 text-white"
          style={{ width: "25%", margin: "0 auto", backgroundColor: "#387ed1", textDecoration: "none" }}
        >
          Signup now
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;

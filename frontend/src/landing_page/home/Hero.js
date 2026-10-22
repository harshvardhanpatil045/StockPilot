import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container p-5 text-center mb-5">
      <div className="row text-center">
        <img src="media/homeHero.png" alt="Hero Banner" className="mb-5" />
        <h1 className="mt-5">Invest in everything</h1>
        <p>Online platform to invest in stocks, derivatives, mutual funds, and more.</p>
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

export default Hero;
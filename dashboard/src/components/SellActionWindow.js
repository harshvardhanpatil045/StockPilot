import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

const SellActionWindow = ({ uid }) => {
  const { closeSellWindow } = useContext(GeneralContext);

  const matchedStock = watchlist.find((s) => s.name === uid);
  const initialPrice = matchedStock ? matchedStock.price : 100.0;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(false);

  const handleSellClick = async () => {
    const qty = Number(stockQuantity);
    const price = Number(stockPrice);

    if (isNaN(qty) || qty <= 0) {
      alert("Please enter a valid positive quantity.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const token = localStorage.getItem("stockpilot_token");
    if (!token) {
      alert("You must be logged in to place an order.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BACKEND_URL}/newOrder`,
        {
          name: uid,
          qty,
          price,
          mode: "SELL",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notify dashboard components that order was placed
      window.dispatchEvent(new Event("stockpilot_order_placed"));
      alert(`Success: Sold ${qty} share(s) of ${uid} at ₹${price.toFixed(2)}`);
      closeSellWindow();
    } catch (error) {
      console.error("Sell order error:", error);
      alert(error.response?.data?.message || "Failed to place sell order.");
    } finally {
      setLoading(false);
    }
  };

  const totalProceeds = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window">
      <div className="regular-order">
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0, color: "#df514c" }}>Sell {uid}</h4>
          <span style={{ fontSize: "0.8rem", color: "#888" }}>NSE Market Order</span>
        </div>
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              min="0.05"
              step="0.05"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Proceeds ₹{isNaN(totalProceeds) ? "0.00" : totalProceeds}</span>
        <div>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: "#df514c",
              color: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
            onClick={handleSellClick}
            disabled={loading}
          >
            {loading ? "Selling..." : "Sell"}
          </button>

          <button
            type="button"
            className="btn btn-grey"
            onClick={closeSellWindow}
            style={{
              cursor: "pointer",
              border: "none",
              backgroundColor: "#9e9e9e",
              color: "#fff",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;

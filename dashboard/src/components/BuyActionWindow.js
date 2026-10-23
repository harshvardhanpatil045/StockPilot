import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

const BuyActionWindow = ({ uid }) => {
  const { closeBuyWindow } = useContext(GeneralContext);

  const matchedStock = watchlist.find((s) => s.name === uid);
  const initialPrice = matchedStock ? matchedStock.price : 100.0;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [loading, setLoading] = useState(false);

  const handleBuyClick = async () => {
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
          mode: "BUY",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Notify dashboard components that order was placed
      window.dispatchEvent(new Event("stockpilot_order_placed"));
      alert(`Success: Bought ${qty} share(s) of ${uid} at ₹${price.toFixed(2)}`);
      closeBuyWindow();
    } catch (error) {
      console.error("Buy order error:", error);
      alert(error.response?.data?.message || "Failed to place buy order.");
    } finally {
      setLoading(false);
    }
  };

  const marginRequired = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between" }}>
          <h4 style={{ margin: 0, color: "#4184f3" }}>Buy {uid}</h4>
          <span style={{ fontSize: "0.8rem", color: "#888" }}>NSE Market Order</span>
        </div>
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              min="0.05"
              step="0.05"
              name="price"
              id="price"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹{isNaN(marginRequired) ? "0.00" : marginRequired}</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={loading}
            style={{ cursor: loading ? "not-allowed" : "pointer", border: "none" }}
          >
            {loading ? "Buying..." : "Buy"}
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={closeBuyWindow}
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

export default BuyActionWindow;

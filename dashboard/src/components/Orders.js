import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(() => {
    const token = localStorage.getItem("stockpilot_token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/allOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchOrders();

    const handleOrderPlaced = () => {
      fetchOrders();
    };

    window.addEventListener("stockpilot_order_placed", handleOrderPlaced);
    return () => {
      window.removeEventListener("stockpilot_order_placed", handleOrderPlaced);
    };
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="orders">
        <p style={{ color: "#888", textAlign: "center", marginTop: "40px" }}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "Just now";

              const isBuy = (order.mode || "").toUpperCase() === "BUY";

              return (
                <tr key={order._id}>
                  <td>{dateStr}</td>
                  <td>
                    <strong>{order.name}</strong>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "3px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        backgroundColor: isBuy ? "#e8f5e9" : "#ffebee",
                        color: isBuy ? "#2e7d32" : "#c62828",
                      }}
                    >
                      {order.mode}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{Number(order.price).toFixed(2)}</td>
                  <td>
                    <span style={{ color: "#4caf50", fontWeight: "500", fontSize: "0.85rem" }}>
                      ● EXECUTED
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;

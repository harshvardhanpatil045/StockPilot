import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";

const Summary = ({ user }) => {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("stockpilot_token");
    if (token) {
      axios
        .get(`${BACKEND_URL}/allHoldings`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setHoldings(res.data);
        })
        .catch((err) => {
          console.error("Summary fetch holdings error:", err);
        });
    }
  }, []);

  const totalInvestment = holdings.reduce(
    (acc, stock) => acc + stock.avg * stock.qty,
    0
  );
  const totalCurrentValue = holdings.reduce(
    (acc, stock) => acc + stock.price * stock.qty,
    0
  );
  const totalPL = totalCurrentValue - totalInvestment;
  const totalPLPercent =
    totalInvestment > 0 ? ((totalPL / totalInvestment) * 100).toFixed(2) : "0.00";

  const username = user?.username || "Trader";

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={totalPL >= 0 ? "profit" : "loss"}>
              {(totalPL / 1000).toFixed(2)}k{" "}
              <small>{totalPL >= 0 ? `+${totalPLPercent}%` : `${totalPLPercent}%`}</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{(totalCurrentValue / 1000).toFixed(2)}k</span>{" "}
            </p>
            <p>
              Investment <span>{(totalInvestment / 1000).toFixed(2)}k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;

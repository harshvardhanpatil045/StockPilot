require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingModel");
const { PositionModel } = require("./model/PositionModel");
const { OrderModel } = require("./model/OrderModel");
const { UserModel } = require("./model/UserModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "stockpilot_super_secret_jwt_key_2026";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.DASHBOARD_URL || "http://localhost:3001",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(null, true); // fallback allow for dev flexibility
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(bodyParser.json());

// --- Initial Portfolio Seed Helper ---
const defaultHoldingsData = [
  { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
  { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
  { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
  { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%" },
  { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
  { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
  { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%" },
  { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
  { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%" },
  { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
  { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%" },
  { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%" },
  { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
];

const defaultPositionsData = [
  { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
  { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
];

async function seedUserData(userId) {
  const existingHoldings = await HoldingsModel.countDocuments({ userId });
  if (existingHoldings === 0) {
    const holdingsToInsert = defaultHoldingsData.map((h) => ({ ...h, userId }));
    await HoldingsModel.insertMany(holdingsToInsert);
  }

  const existingPositions = await PositionModel.countDocuments({ userId });
  if (existingPositions === 0) {
    const positionsToInsert = defaultPositionsData.map((p) => ({ ...p, userId }));
    await PositionModel.insertMany(positionsToInsert);
  }
}

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required. No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
    }
    req.user = decoded;
    next();
  });
};

// --- AUTH ROUTES ---

// POST /signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required." });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    // Check existing user
    const existingUserByEmail = await UserModel.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const existingUserByName = await UserModel.findOne({ username: normalizedUsername });
    if (existingUserByName) {
      return res.status(409).json({ message: "Username is already taken. Please choose another." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    // Seed initial portfolio for this new user
    await seedUserData(newUser._id.toString());

    // Generate JWT
    const token = jwt.sign(
      {
        userId: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error during signup." });
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginIdentifier = (identifier || email || "").trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Please enter your username/email and password." });
    }

    // Find user by email or username
    const user = await UserModel.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { username: loginIdentifier },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email/username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/username or password." });
    }

    // Ensure portfolio exists
    await seedUserData(user._id.toString());

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login." });
  }
});

// GET /verifyUser
app.get("/verifyUser", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ message: "Failed to verify user." });
  }
});

// --- TRADING & PORTFOLIO ROUTES ---

// GET /allHoldings
app.get("/allHoldings", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    let holdings = await HoldingsModel.find({ userId });

    if (holdings.length === 0) {
      await seedUserData(userId);
      holdings = await HoldingsModel.find({ userId });
    }

    res.json(holdings);
  } catch (error) {
    console.error("Fetch holdings error:", error);
    res.status(500).json({ message: "Failed to fetch holdings." });
  }
});

// GET /allPositions
app.get("/allPositions", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    let positions = await PositionModel.find({ userId });

    if (positions.length === 0) {
      await seedUserData(userId);
      positions = await PositionModel.find({ userId });
    }

    res.json(positions);
  } catch (error) {
    console.error("Fetch positions error:", error);
    res.status(500).json({ message: "Failed to fetch positions." });
  }
});

// GET /allOrders
app.get("/allOrders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

// POST /newOrder
app.post("/newOrder", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, qty, price, mode } = req.body;

    const parsedQty = Number(qty);
    const parsedPrice = Number(price);
    const normalizedMode = (mode || "").toUpperCase().trim();

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Stock instrument name is required." });
    }
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }
    if (normalizedMode !== "BUY" && normalizedMode !== "SELL") {
      return res.status(400).json({ message: "Order mode must be either BUY or SELL." });
    }

    // Check existing holding
    let holding = await HoldingsModel.findOne({ userId, name });

    if (normalizedMode === "SELL") {
      if (!holding || holding.qty < parsedQty) {
        return res.status(400).json({
          message: `Insufficient holdings. You currently have ${holding ? holding.qty : 0} shares of ${name}.`,
        });
      }

      if (holding.qty === parsedQty) {
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        holding.qty -= parsedQty;
        await holding.save();
      }
    } else if (normalizedMode === "BUY") {
      if (holding) {
        // Weighted average cost calculation
        const totalQty = holding.qty + parsedQty;
        const totalCost = holding.qty * holding.avg + parsedQty * parsedPrice;
        holding.avg = Number((totalCost / totalQty).toFixed(2));
        holding.qty = totalQty;
        holding.price = parsedPrice;
        await holding.save();
      } else {
        const newHolding = new HoldingsModel({
          userId,
          name,
          qty: parsedQty,
          avg: parsedPrice,
          price: parsedPrice,
          net: "+0.00%",
          day: "+0.00%",
        });
        await newHolding.save();
      }
    }

    // Save executed order
    const newOrder = new OrderModel({
      userId,
      name,
      qty: parsedQty,
      price: parsedPrice,
      mode: normalizedMode,
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: `${normalizedMode} order placed successfully!`,
      order: newOrder,
    });
  } catch (error) {
    console.error("New order error:", error);
    res.status(500).json({ message: "Failed to place order." });
  }
});

// Serve the frontend build
const frontendBuildPath = path.join(__dirname,"../frontend/build");

// Serve the dashboard build
const dashboardBuildPath = path.join(__dirname,"../dashboard/build");

// Dashboard assets and files
app.use("/dashboard",express.static(dashboardBuildPath));

// Frontend assets and files
app.use(express.static(frontendBuildPath));

// Dashboard React Router fallback (Express 5 compatible)
app.get(/^\/dashboard(?:\/.*)?$/, (req, res) => {
  res.sendFile(path.join(dashboardBuildPath, "index.html"));
});

// Frontend React Router fallback
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

// Connect to MongoDB and start server
mongoose
  .connect(uri)
  .then(() => {
    console.log("DB is connected successfully");
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
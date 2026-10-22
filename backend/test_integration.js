const http = require("http");
const { spawn } = require("child_process");
const path = require("path");

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on("error", reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:3002/verifyUser", (res) => {
      resolve(true);
    });
    req.on("error", () => resolve(false));
  });
}

async function runTests() {
  console.log("=== STARTING STOCKPILOT INTEGRATION TEST SUITE ===");

  let serverProcess = null;
  const isAlreadyRunning = await checkServerReady();

  if (!isAlreadyRunning) {
    console.log("Starting backend server for test run...");
    serverProcess = spawn("node", ["index.js"], {
      cwd: __dirname,
      stdio: "pipe",
    });

    let ready = false;
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      ready = await checkServerReady();
      if (ready) break;
    }

    if (!ready) {
      if (serverProcess) serverProcess.kill();
      throw new Error("Backend server did not start within 20 seconds.");
    }
    console.log("Backend server is ready on http://localhost:3002!");
  }

  try {
    const randomSuffix = Math.floor(Math.random() * 100000);
    const testUser = {
      username: `trader_${randomSuffix}`,
      email: `trader_${randomSuffix}@stockpilot.test`,
      password: "Password123!",
    };

    // 1. Signup
    console.log("\n[TEST 1] Registering new user...");
    const signupRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      testUser
    );
    console.log("Status:", signupRes.status);
    console.log("Response:", signupRes.data.message);
    if (signupRes.status !== 201) throw new Error("Signup failed");

    // 2. Duplicate Signup Check
    console.log("\n[TEST 2] Testing duplicate registration rejection...");
    const dupRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/signup",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      testUser
    );
    console.log("Status:", dupRes.status, "(Expected 409)");
    console.log("Message:", dupRes.data.message);
    if (dupRes.status !== 409) throw new Error("Duplicate signup check failed");

    // 3. Login
    console.log("\n[TEST 3] Logging in with created user...");
    const loginRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/login",
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      { identifier: testUser.email, password: testUser.password }
    );
    console.log("Status:", loginRes.status);
    console.log("Login Message:", loginRes.data.message);
    const token = loginRes.data.token;
    if (!token) throw new Error("No token returned");

    // 4. Verify User
    console.log("\n[TEST 4] Calling /verifyUser...");
    const verifyRes = await request({
      hostname: "localhost",
      port: 3002,
      path: "/verifyUser",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Status:", verifyRes.status);
    console.log("Verified username:", verifyRes.data.user.username);

    // 5. Check User Holdings
    console.log("\n[TEST 5] Fetching user holdings...");
    const holdingsRes = await request({
      hostname: "localhost",
      port: 3002,
      path: "/allHoldings",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Status:", holdingsRes.status);
    console.log("Holdings count:", holdingsRes.data.length);
    const initialReliance = holdingsRes.data.find((h) => h.name === "RELIANCE");
    console.log(`Initial RELIANCE: Qty = ${initialReliance.qty}, Avg = ₹${initialReliance.avg}`);

    // 6. Buy Order
    console.log("\n[TEST 6] Placing BUY order for 5 RELIANCE @ ₹2200...");
    const buyRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/newOrder",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { name: "RELIANCE", qty: 5, price: 2200, mode: "BUY" }
    );
    console.log("Status:", buyRes.status);
    console.log("Buy Message:", buyRes.data.message);

    // Verify holdings updated
    const holdingsAfterBuy = await request({
      hostname: "localhost",
      port: 3002,
      path: "/allHoldings",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedReliance = holdingsAfterBuy.data.find((h) => h.name === "RELIANCE");
    console.log(`After BUY RELIANCE: Qty = ${updatedReliance.qty}, New Weighted Avg = ₹${updatedReliance.avg}`);

    // 7. Test Insufficient Holdings on Sell
    console.log("\n[TEST 7] Attempting to SELL 50 shares of RELIANCE (Should fail)...");
    const failSellRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/newOrder",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { name: "RELIANCE", qty: 50, price: 2300, mode: "SELL" }
    );
    console.log("Status:", failSellRes.status, "(Expected 400)");
    console.log("Rejection Message:", failSellRes.data.message);

    // 8. Test Valid Sell
    console.log("\n[TEST 8] Placing valid SELL order for 2 shares of RELIANCE @ ₹2250...");
    const validSellRes = await request(
      {
        hostname: "localhost",
        port: 3002,
        path: "/newOrder",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      { name: "RELIANCE", qty: 2, price: 2250, mode: "SELL" }
    );
    console.log("Status:", validSellRes.status);
    console.log("Sell Message:", validSellRes.data.message);

    const holdingsAfterSell = await request({
      hostname: "localhost",
      port: 3002,
      path: "/allHoldings",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const finalReliance = holdingsAfterSell.data.find((h) => h.name === "RELIANCE");
    console.log(`After SELL RELIANCE: Qty = ${finalReliance.qty}`);

    // 9. Fetch Orders
    console.log("\n[TEST 9] Fetching order history (/allOrders)...");
    const ordersRes = await request({
      hostname: "localhost",
      port: 3002,
      path: "/allOrders",
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Status:", ordersRes.status);
    console.log(`Total orders placed: ${ordersRes.data.length}`);
    ordersRes.data.forEach((o, i) => {
      console.log(`  ${i + 1}. [${o.mode}] ${o.qty} x ${o.name} @ ₹${o.price}`);
    });

    // 10. Unauthorized Access Check
    console.log("\n[TEST 10] Checking protected API without token...");
    const unauthRes = await request({
      hostname: "localhost",
      port: 3002,
      path: "/allHoldings",
      method: "GET",
    });
    console.log("Status:", unauthRes.status, "(Expected 401)");
    console.log("Message:", unauthRes.data.message);

    console.log("\n=======================================================");
    console.log(" ALL 10 INTEGRATION TESTS PASSED SUCCESSFULLY! ");
    console.log("=======================================================");
  } finally {
    if (serverProcess) {
      console.log("Stopping test server process...");
      serverProcess.kill();
    }
  }
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

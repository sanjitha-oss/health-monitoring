// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Models
const User = require("./models/User");

// Routes (for vitals APIs)


const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:5000"
  ],
  credentials: true
}));


// Handle preflight requests for all routes


app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Force-download route for dashboard HTML
app.get('/download/dashboard', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'dashboard.html');
  res.download(filePath, 'dashboard.html', (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) res.status(500).send('Error downloading file');
    }
  });
});

/* ============================
   AUTH ROUTES (REGISTER + LOGIN)
   ============================ */

// POST /api/auth/register
// Body: { "name": "Jayanth", "email": "jayanth@example.com", "password": "123456" }
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
// Body: { "email": "jayanth@example.com", "password": "123456" }
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   VITALS ROUTES
   ============================ */

// All /api/vitals/* handled in routes/vitals.js
app.use("/auth", require("./routes/auth")); // Your login/register routes
app.use("/vitals", require("./routes/vitals")); 
/* ============================
   DEFAULT USER (OPTIONAL)
   ============================ */

// This will automatically create:
// name: "Jayanth", email: "jayanth@example.com", password: "123456"
// if it doesn't already exist.
async function createDefaultUser() {
  try {
    const email = "jayanth@example.com";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("ℹ️ Default user already exists");
      return;
    }

    const hash = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Jayanth",
      email,
      passwordHash: hash,
    });

    console.log("✅ Default user created:", email);
  } catch (err) {
    console.error("Error creating default user:", err);
  }
}

/* ============================
   MONGODB CONNECTION + SERVER
   ============================ */

const startServer = (port = process.env.PORT || 3000) => {
  app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
};

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "health_monitor" })
    .then(async () => {
      console.log("✅ MongoDB connected");
      // create default user once (optional)
      await createDefaultUser();
      startServer();
    })
    .catch((err) => {
      console.error("❌ Mongo error", err);
      console.warn('Starting server without DB connection (static frontend/testing mode)');
      startServer();
    });
} else {
  console.warn('MONGO_URI not set — starting server without DB (static frontend/testing mode)');
  startServer();
}


require("dotenv").config();

const storeRoutes = require("./routes/storeRoutes");
const express = require("express");
const cors = require("cors");

const prisma = require("./config/prisma");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const { authorizeRoles } = require("./middleware/authMiddleware");

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);

// Protected admin test
app.get(
  "/api/admin/test",
  authMiddleware,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome, Administrator!",
      user: req.user
    });
  }
);

// Database health check
app.get("/api/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "Database connected successfully!"
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Server health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Roxiler Rating System API is running!"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

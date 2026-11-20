
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  updatePassword,
  getMe
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// User registration
router.post("/signup", signup);

// User login
router.post("/login", login);

// Get logged-in user
router.get("/me", authMiddleware, getMe);

// Update password
router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;

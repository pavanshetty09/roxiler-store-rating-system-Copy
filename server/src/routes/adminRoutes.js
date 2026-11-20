const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");


const {
    createUser,
    getAllUsers,
    getUserById
} = require("../controllers/adminController");

const { getAdminDashboard } =
  require("../controllers/dashboardController");

// Protect all admin routes
router.use(authMiddleware, authorizeRoles("ADMIN"));

// Create a user
router.post("/users", createUser);

// Get all users
router.get("/users", getAllUsers);
router.get("/dashboard/stats", getAdminDashboard);
// Get user by ID
router.get("/users/:id", getUserById);

module.exports = router;
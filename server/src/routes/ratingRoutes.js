
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");

const {
  submitRating,
  getMyRatings,
  getOwnerDashboard
} = require("../controllers/ratingController");

// All rating routes require authentication
router.use(authMiddleware);

// USER routes
router.post("/", authorizeRoles("USER"), submitRating);
router.get("/my", authorizeRoles("USER"), getMyRatings);

// STORE_OWNER dashboard
router.get(
  "/owner/dashboard",
  authorizeRoles("STORE_OWNER"),
  getOwnerDashboard
);

module.exports = router;

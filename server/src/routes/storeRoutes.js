
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");

const {
  createStore,
  getAllStores,
  getStoreById
} = require("../controllers/storeController");

// All store routes require login
router.use(authMiddleware);

// Only ADMIN can create stores
router.post("/", authorizeRoles("ADMIN"), createStore);

// Logged-in users can view stores
router.get("/", getAllStores);
router.get("/:id", getStoreById);

module.exports = router;

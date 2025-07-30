// File: server/routes/admin.js

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  createRoute,
  updateRoute,
  deleteRoute,
  createStop,
  updateStop,
  deleteStop,
  setSchedule,
  setFare,
  createServiceAlert,
} = require("../controllers/adminController");

// Add this to your server/routes/admin.js file

// ... other imports
const { createSimpleRoute } = require("../controllers/simpleRoutesController");

// ... other routes

// Simple Route management
router.route("/simpleroutes").post(protect, admin, createSimpleRoute);

// --- All routes in this file are protected and require admin access ---

// Route management
router.route("/routes").post(protect, admin, createRoute);
router
  .route("/routes/:id")
  .put(protect, admin, updateRoute)
  .delete(protect, admin, deleteRoute);

// Stop management
router.route("/stops").post(protect, admin, createStop);
router
  .route("/stops/:id")
  .put(protect, admin, updateStop)
  .delete(protect, admin, deleteStop);

// Schedule management
router.route("/schedules").post(protect, admin, setSchedule);

// Fare management
router.route("/fares").post(protect, admin, setFare);

// Service Alert management
router.route("/alerts").post(protect, admin, createServiceAlert);

module.exports = router;

// File: server/routes/routes.js

const express = require("express");
const router = express.Router();
const {
  findDirectRoutes,
  getAllRoutes,
  getRouteById,
  getAllStops,
  getScheduleForRoute,
} = require("../controllers/routesController");

// --- Public Routes for Transportation Data ---

// THE MAIN EVENT: Find routes between two stops
router.post("/find", findDirectRoutes);

// GET all active routes
router.get("/", getAllRoutes);

// GET a single route by its ID
router.get("/:id", getRouteById);

// GET all stops
router.get("/stops/all", getAllStops);

// GET the schedule for a specific route
router.get("/schedules/route/:routeId", getScheduleForRoute);

module.exports = router;

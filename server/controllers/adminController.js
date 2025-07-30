// File: server/controllers/adminController.js

const Route = require("../models/Route");
const Stop = require("../models/Stop");
const Schedule = require("../models/Schedule");
const Fare = require("../models/Fare");
const ServiceAlert = require("../models/ServiceAlert");

// --- Route Management ---

// @desc    Create a new route
// @route   POST /api/admin/routes
// @access  Private/Admin
const createRoute = async (req, res) => {
  const { name, type, path, stops, color } = req.body;
  try {
    const route = new Route({ name, type, path, stops, color });
    const createdRoute = await route.save();
    res.status(201).json(createdRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an existing route
// @route   PUT /api/admin/routes/:id
// @access  Private/Admin
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (route) {
      route.name = req.body.name || route.name;
      route.type = req.body.type || route.type;
      route.path = req.body.path || route.path;
      route.stops = req.body.stops || route.stops;
      route.color = req.body.color || route.color;
      route.isActive =
        req.body.isActive !== undefined ? req.body.isActive : route.isActive;

      const updatedRoute = await route.save();
      res.json(updatedRoute);
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a route
// @route   DELETE /api/admin/routes/:id
// @access  Private/Admin
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (route) {
      await route.remove();
      await Schedule.deleteMany({ route: req.params.id });
      res.json({ message: "Route and associated schedules removed" });
    } else {
      res.status(404).json({ message: "Route not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Stop Management ---

// @desc    Create a new stop
// @route   POST /api/admin/stops
// @access  Private/Admin
const createStop = async (req, res) => {
  const { name, location } = req.body;
  try {
    const stop = new Stop({ name, location });
    const createdStop = await stop.save();
    res.status(201).json(createdStop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a stop
// @route   PUT /api/admin/stops/:id
// @access  Private/Admin
const updateStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (stop) {
      stop.name = req.body.name || stop.name;
      stop.location = req.body.location || stop.location;
      const updatedStop = await stop.save();
      res.json(updatedStop);
    } else {
      res.status(404).json({ message: "Stop not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a stop
// @route   DELETE /api/admin/stops/:id
// @access  Private/Admin
const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (stop) {
      await stop.remove();
      await Schedule.deleteMany({ stop: req.params.id });
      await Route.updateMany({}, { $pull: { stops: req.params.id } });
      res.json({ message: "Stop removed from schedules and routes" });
    } else {
      res.status(404).json({ message: "Stop not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Schedule Management ---

// @desc    Create or update a schedule for a route/stop
// @route   POST /api/admin/schedules
// @access  Private/Admin
const setSchedule = async (req, res) => {
  const { route, stop, arrivalTimes } = req.body;
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { route, stop }, // find a schedule with this route and stop
      { arrivalTimes }, // update its arrival times
      { new: true, upsert: true } // options: return the new version, and create if it doesn't exist
    );
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- Fare Management ---

// @desc    Create or update a fare for a route type
// @route   POST /api/admin/fares
// @access  Private/Admin
const setFare = async (req, res) => {
  const { routeType, baseFare, perStopCharge } = req.body;
  try {
    const fare = await Fare.findOneAndUpdate(
      { routeType },
      { baseFare, perStopCharge },
      { new: true, upsert: true }
    );
    res.status(201).json(fare);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- Service Alert Management ---

// @desc    Create a service alert
// @route   POST /api/admin/alerts
// @access  Private/Admin
const createServiceAlert = async (req, res) => {
  const { title, description, type, affectedRoutes, endsAt } = req.body;
  try {
    const alert = new ServiceAlert({
      title,
      description,
      type,
      affectedRoutes,
      endsAt,
    });
    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRoute,
  updateRoute,
  deleteRoute,
  createStop,
  updateStop,
  deleteStop,
  setSchedule,
  setFare,
  createServiceAlert,
};

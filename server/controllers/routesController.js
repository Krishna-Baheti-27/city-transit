// File: server/controllers/routesController.js

const Route = require("../models/Route");
const Stop = require("../models/Stop");
const Schedule = require("../models/Schedule");
const Fare = require("../models/Fare");
const ServiceAlert = require("../models/ServiceAlert");

// @desc    Find direct routes between two stops
// @route   POST /api/routes/find
// @access  Public
const findDirectRoutes = async (req, res) => {
  const { fromStopId, toStopId } = req.body;

  if (!fromStopId || !toStopId) {
    return res
      .status(400)
      .json({ message: "Source and destination stops are required." });
  }

  try {
    // 1. Find all routes that contain both stops
    const potentialRoutes = await Route.find({
      stops: { $all: [fromStopId, toStopId] },
      isActive: true,
    }).populate("stops");

    if (!potentialRoutes.length) {
      return res.json([]); // Return empty array if no routes connect the stops
    }

    const validJourneys = [];

    // 2. Process each potential route to find valid journeys
    for (const route of potentialRoutes) {
      const fromIndex = route.stops.findIndex(
        (s) => s._id.toString() === fromStopId
      );
      const toIndex = route.stops.findIndex(
        (s) => s._id.toString() === toStopId
      );

      // 3. Ensure the journey is in the correct direction (from stop comes before to stop)
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex < toIndex) {
        // a. Extract the stops for this specific journey
        const journeyStops = route.stops.slice(fromIndex, toIndex + 1);

        // b. Calculate the fare
        const fareInfo = await Fare.findOne({ routeType: route.type });
        const fare = fareInfo
          ? fareInfo.baseFare +
            fareInfo.perStopCharge * (journeyStops.length - 1)
          : null;

        // c. Check for active service alerts for this route
        const now = new Date();
        const alert = await ServiceAlert.findOne({
          affectedRoutes: route._id,
          startsAt: { $lte: now },
          endsAt: { $gte: now },
        });

        // d. Assemble the journey details
        validJourneys.push({
          routeId: route._id,
          routeName: route.name,
          routeType: route.type,
          routeColor: route.color,
          path: route.path, // For now, we send the full route path
          stops: journeyStops,
          fare: fare,
          alert: alert
            ? {
                title: alert.title,
                description: alert.description,
                type: alert.type,
              }
            : null,
        });
      }
    }

    res.json(validJourneys);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// --- Existing Functions ---

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true }).populate("stops");
    res.json(routes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get a single route by ID
// @route   GET /api/routes/:id
// @access  Public
const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate("stops");
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get all stops
// @route   GET /api/stops
// @access  Public
const getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc    Get schedule for a specific route
// @route   GET /api/schedules/route/:routeId
// @access  Public
const getScheduleForRoute = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      route: req.params.routeId,
    }).populate("stop", "name location");
    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No schedules found for this route" });
    }
    res.json(schedules);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  findDirectRoutes,
  getAllRoutes,
  getRouteById,
  getAllStops,
  getScheduleForRoute,
};

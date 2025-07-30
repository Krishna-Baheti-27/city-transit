// File: server/controllers/adminController.js

const axios = require("axios");
const Route = require("../models/SimpleRoute");
const Stop = require("../models/Stop");
const Schedule = require("../models/Schedule");
const Fare = require("../models/Fare");
const ServiceAlert = require("../models/ServiceAlert");

// --- "Smart" Stop Management ---

// @desc    Create a new stop by geocoding its name
// @route   POST /api/admin/stops
// @access  Private/Admin
const createStop = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Stop name is required." });
  }

  try {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      name
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(geocodeUrl);

    if (response.data.status !== "OK" || !response.data.results[0]) {
      return res.status(400).json({
        message: `Could not find coordinates for "${name}". Please be more specific.`,
      });
    }

    const { lat, lng } = response.data.results[0].geometry.location;

    const stop = new Stop({
      name,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
    const createdStop = await stop.save();
    res.status(201).json(createdStop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during geocoding." });
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
      // If location is updated, it should also be geocoded if it's a string name
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
      res.json({ message: "Stop removed" });
    } else {
      res.status(404).json({ message: "Stop not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- "Smart" Route Management ---

// @desc    Create a new route and auto-generate its path
// @route   POST /api/admin/routes
// @access  Private/Admin
const createRoute = async (req, res) => {
  const { name, type, stops, color } = req.body;

  if (!name || !type || !stops || stops.length < 2) {
    return res.status(400).json({
      message: "Route name, type, and at least two stops are required.",
    });
  }

  try {
    const stopDocs = await Stop.find({ _id: { $in: stops } });
    const sortedStopDocs = stops.map((stopId) =>
      stopDocs.find((doc) => doc._id.toString() === stopId)
    );

    if (sortedStopDocs.includes(undefined)) {
      return res
        .status(400)
        .json({ message: "One or more stop IDs are invalid." });
    }

    const origin = sortedStopDocs[0].location.coordinates
      .slice()
      .reverse()
      .join(",");
    const destination = sortedStopDocs[
      sortedStopDocs.length - 1
    ].location.coordinates
      .slice()
      .reverse()
      .join(",");
    const waypoints = sortedStopDocs
      .slice(1, -1)
      .map((doc) => doc.location.coordinates.slice().reverse().join(","))
      .join("|");

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${waypoints}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(directionsUrl);

    if (response.data.status !== "OK" || !response.data.routes[0]) {
      return res.status(400).json({
        message: "Could not generate a route path from the given stops.",
      });
    }

    const pathCoordinates = response.data.routes[0].legs.flatMap((leg) =>
      leg.steps.flatMap((step) => [
        [step.start_location.lng, step.start_location.lat],
        [step.end_location.lng, step.end_location.lat],
      ])
    );

    const route = new Route({
      name,
      type,
      stops: sortedStopDocs.map((doc) => doc._id),
      color,
      path: {
        type: "LineString",
        coordinates: pathCoordinates,
      },
    });
    const createdRoute = await route.save();
    res.status(201).json(createdRoute);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during route creation." });
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
      route.stops = req.body.stops || route.stops;
      route.color = req.body.color || route.color;
      route.isActive =
        req.body.isActive !== undefined ? req.body.isActive : route.isActive;
      // Note: Updating the path automatically if stops change would require re-calling the Directions API.
      // For simplicity, we are not doing that here. An admin would need to re-create the route.
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

// --- Other Admin Functions ---

const setSchedule = async (req, res) => {
  /* ... existing code ... */
};
const setFare = async (req, res) => {
  /* ... existing code ... */
};
const createServiceAlert = async (req, res) => {
  /* ... existing code ... */
};

// **THE FIX IS HERE**
// We are now exporting all the functions that admin.js needs.
module.exports = {
  createStop,
  updateStop,
  deleteStop,
  createRoute,
  updateRoute,
  deleteRoute,
  setSchedule,
  setFare,
  createServiceAlert,
};

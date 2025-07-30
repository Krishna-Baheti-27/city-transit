// File: server/controllers/simpleRoutesController.js

const SimpleRoute = require("../models/SimpleRoute"); // Make sure to use our new model

// @desc    Create a new simple route
// @route   POST /api/admin/simpleroutes
// @access  Private/Admin
const createSimpleRoute = async (req, res) => {
  const {
    sourceName,
    destinationName,
    sourceLocation,
    destinationLocation,
    fare,
  } = req.body;

  // Basic validation
  if (
    !sourceName ||
    !destinationName ||
    !sourceLocation ||
    !destinationLocation ||
    fare === undefined
  ) {
    return res
      .status(400)
      .json({
        message:
          "All fields are required: sourceName, destinationName, sourceLocation, destinationLocation, fare.",
      });
  }

  try {
    const newRoute = new SimpleRoute({
      sourceName,
      destinationName,
      sourceLocation,
      destinationLocation,
      fare,
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    // Handle the case where the route already exists (due to the unique index)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "A route with this source and destination already exists.",
        });
    }
    console.error(error);
    res.status(500).json({ message: "Server error creating route." });
  }
};

// @desc    Find a simple route by source and destination names
// @route   POST /api/simpleroutes/find
// @access  Public
const findSimpleRoute = async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res
      .status(400)
      .json({ message: "Source and destination are required." });
  }

  try {
    const route = await SimpleRoute.findOne({
      sourceName: source,
      destinationName: destination,
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    // Return the data in the format the frontend needs
    res.json({
      fare: route.fare,
      source: {
        name: route.sourceName,
        location: route.sourceLocation.coordinates,
      },
      destination: {
        name: route.destinationName,
        location: route.destinationLocation.coordinates,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error finding route." });
  }
};

module.exports = {
  createSimpleRoute,
  findSimpleRoute,
};

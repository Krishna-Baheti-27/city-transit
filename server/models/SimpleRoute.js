// File: server/models/SimpleRoute.js
// Note: You can create a new file or replace your existing Route.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SimpleRouteSchema = new Schema({
  sourceName: {
    type: String,
    required: true,
    trim: true,
    // Create a compound index for efficient lookups
    index: true,
  },
  destinationName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  sourceLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  destinationLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  fare: {
    type: Number,
    required: true,
  },
});

// Ensure that each source-destination pair is unique
SimpleRouteSchema.index(
  { sourceName: 1, destinationName: 1 },
  { unique: true }
);

module.exports = mongoose.model("SimpleRoute", SimpleRouteSchema);

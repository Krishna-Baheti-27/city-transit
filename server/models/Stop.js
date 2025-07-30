const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StopSchema = new Schema({
  name: {
    type: String,
    required: [true, "Stop name is required"],
    trim: true,
  },
  // Using GeoJSON format for location data for geospatial queries
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Create a 2dsphere index for geospatial queries, which is crucial for finding nearby stops
StopSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Stop", StopSchema);

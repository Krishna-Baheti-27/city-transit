const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  name: {
    type: String,
    required: [true, "Route name is required"],
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["Shuttle", "Bus", "Metro"],
    required: [true, "Route type is required"],
  },
  // The path of the route for drawing on the map
  path: {
    type: {
      type: String,
      enum: ["LineString"],
      required: true,
    },
    coordinates: {
      type: [[Number]], // An array of [longitude, latitude] pairs
      required: true,
    },
  },
  // An array of Stop ObjectIDs that are part of this route
  stops: [
    {
      type: Schema.Types.ObjectId,
      ref: "Stop",
    },
  ],
  color: {
    type: String,
    default: "#3498db", // A nice default blue color for routes
  },
  // Indicates if the route is currently active or not
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Route", RouteSchema);

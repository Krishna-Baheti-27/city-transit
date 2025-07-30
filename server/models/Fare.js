const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FareSchema = new Schema({
  routeType: {
    type: String,
    enum: ["Shuttle", "Bus", "Metro"],
    required: true,
    unique: true, // Only one fare document per route type
  },
  baseFare: {
    type: Number,
    required: [true, "Base fare is required"],
    min: 0,
  },
  perStopCharge: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model("Fare", FareSchema);

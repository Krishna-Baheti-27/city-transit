const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  route: {
    type: Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
  stop: {
    type: Schema.Types.ObjectId,
    ref: "Stop",
    required: true,
  },
  // An array of scheduled arrival times in "HH:MM" (24-hour) format
  arrivalTimes: [
    {
      type: String,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format. Use HH:MM",
      ],
    },
  ],
});

// Ensure a unique schedule per route and stop combination
ScheduleSchema.index({ route: 1, stop: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);

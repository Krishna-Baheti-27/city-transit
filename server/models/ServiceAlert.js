const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceAlertSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
    },
    description: {
      type: String,
      required: [true, "Alert description is required"],
    },
    type: {
      type: String,
      enum: ["Delay", "Detour", "Closure", "Info"],
      default: "Info",
    },
    affectedRoutes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Route",
      },
    ],
    // The alert becomes active at this time
    startsAt: {
      type: Date,
      default: Date.now,
    },
    // The alert is no longer active after this time
    endsAt: {
      type: Date,
      required: [true, "Alert end time is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceAlert", ServiceAlertSchema);

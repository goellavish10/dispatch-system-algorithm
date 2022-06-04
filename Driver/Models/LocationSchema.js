const mongoose = require("mongoose");
const driverLocation = new mongoose.Schema(
  {
    driverId: {
      type: Number,
      required: true,
    },
    currentLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    headingLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = DriverLocation = mongoose.model(
  "driver_location",
  driverLocation
);

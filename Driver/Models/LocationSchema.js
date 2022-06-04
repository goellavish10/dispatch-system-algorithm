const mongoose = require("mongoose");
const driverLocation = new mongoose.Schema(
  {
    driverId: {
      type: Number,
      required: true,
    },
    currentLocation: {
      type: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    headingLocation: {
      type: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

driverLocation.index({
  currentLocation: "2dsphere",
});

driverLocation.index({
  headingLocation: "2dsphere",
});

module.exports = DriverLocation = mongoose.model(
  "driver_location",
  driverLocation
);

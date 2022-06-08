const mongoose = require("mongoose");
const vehicleSchema = new mongoose.Schema(
  {
    VEHICLE: {
      type: String,
      required: true,
    },
    MAX_WEIGHT: {
      type: Number,
      required: true,
    },
    MAX_LENGTH: {
      type: Number,
      required: true,
    },
    MAX_HEIGHT: {
      type: Number,
      required: true,
    },
    MAX_WIDTH: {
      type: Number,
      required: true,
    },
    PALLETS: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = VehicleData = mongoose.model("vehicle", vehicleSchema);

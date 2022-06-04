const mongoose = require("mongoose");
const suburbCoordinateData = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    urban_area: {
      type: String,
    },
    state_code: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postcode: {
      type: Number,
    },
    type: {
      type: String,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    elevation: {
      type: Number,
    },
    population: {
      type: Number,
    },
    area_sq_km: {
      type: Number,
    },
    region: {
      type: String,
    },
    time_zone: {
      type: String,
    },
    local_government_area: {
      type: String,
    },
    median_income: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = SuburbCoordinate = mongoose.model(
  "suburbCoordinateData",
  suburbCoordinateData
);

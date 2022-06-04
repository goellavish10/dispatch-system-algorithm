const express = require("express");
const {
  driverCoordinatesUpdate,
} = require("../Controllers/jobDetailsController");

const router = express.Router();

router.get("/update-driver-coordinates", driverCoordinatesUpdate);

module.exports = router;

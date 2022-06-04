const express = require("express");
const fs = require("fs/promises");
const {
  driverCoordinatesUpdate,
  receiveJobCoordinates,
} = require("../Controllers/jobDetailsController");

const router = express.Router();

router.get("/update-driver-coordinates", driverCoordinatesUpdate);
router.post("/job-coordinates", receiveJobCoordinates);

module.exports = router;

const express = require("express");
const { receiveJobData } = require("../Controllers/jobDetailsController");

const {
  driverCoordinatesUpdate,
  driverVehicleInfo,
} = require("../Controllers/driverDataController");
const ServiceCodeSchema = require("../Models/ServiceCodeSchema");

const router = express.Router();

router.get("/update-driver-coordinates", driverCoordinatesUpdate);
router.get("/vehicle-data", driverVehicleInfo);
router.post("/job-coordinates", receiveJobData);
router.get("/service-code", async (req, res) => {
  try {
    const vehicleData = require("../vehicledata.json");
    for (let i = 0; i < vehicleData.length; i++) {
      const { CODE, SERVICE_TYPE, VEHICLE } = vehicleData[i];
      const vehicle = new ServiceCodeSchema({
        code: CODE,
        serviceType: SERVICE_TYPE,
        vehicleType: VEHICLE,
      });

      await vehicle.save();
      console.log(`${i} Document Created!`);
    }
    res.json({ msg: "Done" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

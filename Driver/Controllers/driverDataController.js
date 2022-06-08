const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs/promises");
const DriverLocation = require("../Models/DriverSchema");
const VehicleData = require("../Models/VehicleSchema");

async function findCoordinates(add) {
  let response = await fetch(
    `http://api.positionstack.com/v1/forward?access_key=6e148bf58b59319e84e41a862353f141&query=${add}, Australia`
  );

  let coordinates = await response.json();

  return coordinates;
}

module.exports.driverCoordinatesUpdate = async (req, res) => {
  try {
    console.log("Starting Loading Up data");
    const sampleData = require("../newSample.json");

    let newArr = [];
    const vehicleData = await VehicleData.find({});

    const vehicleJSON = require("../vehicledata.json");
    for (let i = 0; i < sampleData.length; i++) {
      const coordinates = await findCoordinates(sampleData[i]["From Address"]);

      if (
        coordinates.data[0] === undefined ||
        coordinates.data[0].latitude === undefined ||
        coordinates.data[0].longitude === undefined
      ) {
        continue;
      }

      const { latitude, longitude } = coordinates.data[0];

      const coordinates_ = await findCoordinates(
        sampleData[Math.floor(Math.random() * (sampleData.length - 1) + 1)][
          "To Address"
        ]
      );

      if (
        coordinates_.data[0] === undefined ||
        coordinates_.data[0].latitude === undefined ||
        coordinates_.data[0].longitude === undefined
      ) {
        continue;
      }

      const { latitude: latitude_, longitude: longitude_ } =
        coordinates_.data[0];
      const randomVar = Math.floor(
        Math.random() * (vehicleData.length - 1) + 1
      );

      let serviceCodeArr = vehicleJSON.filter((el) => {
        return el.VEHICLE === vehicleData[randomVar].VEHICLE;
      });

      const newDriverLocation = new DriverLocation({
        driverId: i,
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        headingLocation: {
          type: "Point",
          coordinates: [longitude_, latitude_],
        },
        vehicleType: vehicleData[randomVar]["VEHICLE"],
        vehicleDetail: vehicleData[randomVar],
      });

      await newDriverLocation.save();

      console.log(`${i} Driver Location Saved`);
    }

    await fs.writeFile("./coordinateData.json", JSON.stringify(newArr));
    res.json({ msg: "Data written!" });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

module.exports.driverVehicleInfo = async (req, res) => {
  try {
    const vehicleData = require("../vehicledata.json");

    for (let i = 0; i < vehicleData.length; i++) {
      const existing = await VehicleData.findOne({
        VEHICLE: vehicleData[i]["VEHICLE"],
      });
      if (existing === undefined || existing === null) {
        const newVehicleData = new VehicleData({
          VEHICLE: vehicleData[i]["VEHICLE"],
          MAX_WEIGHT: vehicleData[i]["MAX_WEIGHT"],
          MAX_LENGTH: vehicleData[i]["MAX_LENGTH"],
          MAX_HEIGHT: vehicleData[i]["MAX_HEIGHT"],
          MAX_WIDTH: vehicleData[i]["MAX_WIDTH"],
          PALLETS: vehicleData[i]["PALLETS"],
        });
        await newVehicleData.save();
      }

      console.log(`${i} Vehicle Data Saved`);
    }

    res.json({ msg: "Vehicle Data uploaded" });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

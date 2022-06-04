const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs/promises");
const DriverLocation = require("../Models/LocationSchema");

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

module.exports.receiveJobCoordinates = async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
    } = req.body;

    const newObj = {
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
    };

    const nearestDrivers = await DriverLocation.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [pickupLongitude, pickupLatitude],
          },
          distanceField: "dist.caluclated",
          includeLocs: "dist.location",
          spherical: true,
          key: "currentLocation",
        },
      },
      { $limit: 10 },
    ]);

    console.log(nearestDrivers);
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

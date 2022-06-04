const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs/promises");
const DriverLocation = require("../Models/LocationSchema");

module.exports.driverCoordinatesUpdate = async (req, res) => {
  try {
    const sampleData = require("../sample.json");

    let newArr = [];

    for (let i = 0; i < sampleData.length; i++) {
      const response = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=6e148bf58b59319e84e41a862353f141&query=${sampleData[i]["From Address"]}, Australia`
      );

      const coordinates = await response.json();

      const { latitude, longitude } = coordinates.data[0];

      const response_ = await fetch(
        `http://api.positionstack.com/v1/forward?access_key=6e148bf58b59319e84e41a862353f141&query=${
          sampleData[Math.floor(Math.random() * sampleData.length + 1)][
            "From Address"
          ]
        }, Australia`
      );

      const coordinates_ = await response_.json();

      if (coordinates_.data === undefined) console.log(coordinates_.data);

      const { latitude: latitude_, longitude: longitude_ } =
        coordinates_.data[0];

      const newDriverLocation = new DriverLocation({
        driverId: i,
        currentLocation: {
          latitude,
          longitude,
        },
        headingLocation: {
          latitude: latitude_,
          longitude: longitude_,
        },
      });

      await newDriverLocation.save();
    }

    await fs.writeFile("./coordinateData.json", JSON.stringify(newArr));
    res.json({ msg: "Data written!" });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

const DriverLocation = require("../Models/DriverSchema");
const ServiceCodeSchema = require("../Models/ServiceCodeSchema");
const arraySort = require("array-sort");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports.receiveJobData = async (req, res) => {
  try {
    const {
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
      length,
      height,
      width,
      bookingId,
      serviceCode,
    } = req.body;

    const cubicVolume = length * height * width;

    const vehicleChosen = await ServiceCodeSchema.find({ code: serviceCode });

    console.log(vehicleChosen[0].vehicleType);

    let nearestDrivers = await DriverLocation.aggregate([
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
          query: { vehicleType: vehicleChosen[0].vehicleType.toUpperCase() },
        },
      },
      { $limit: 10 },
    ]);

    let newArr = [];

    for (let i = 0; i < nearestDrivers.length; i++) {
      nearestDrivers[i].availableSpace =
        nearestDrivers[i].availableSpace - cubicVolume;

      if (nearestDrivers[i].availableSpace >= 0) {
        newArr.push(nearestDrivers[i]);
      }
    }

    const delivery = await fetch(
      `http://api.positionstack.com/v1/reverse?access_key=${process.env.POSITION_KEY}&query=${deliveryLatitude},${deliveryLongitude}`
    );

    const deliveryAddress = await delivery.json();

    for (let i = 0; i < newArr.length; i++) {
      const reverseGeoCoding = await fetch(
        `http://api.positionstack.com/v1/reverse?access_key=${process.env.POSITION_KEY}&query=${newArr[i].headingLocation.coordinates[1]},${newArr[i].headingLocation.coordinates[0]}`
      );

      const address = await reverseGeoCoding.json();

      const result = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${address.data[0].label}&destinations=${deliveryAddress.data[0].label}&units=metric&key=${process.env.GCP_API}`
      );

      const { rows } = await result.json();

      newArr[i].gap = rows[0].elements[0].distance.value;
    }

    const sortedArr = arraySort(newArr, ["availableSpace", "gap"]);

    console.log(sortedArr);

    const driver = await DriverLocation.findOneAndUpdate(
      { _id: sortedArr[0]._id },
      {
        $push: { activeJobs: bookingId },
        $set: { availableSpace: sortedArr[0].availableSpace },
      },
      { new: true }
    );

    console.log(driver);

    res.json({ msg: "Done", driver, nearestDrivers, sortedArr });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

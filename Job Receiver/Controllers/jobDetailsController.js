const Booking = require("../Models/JobDetailsSchema");
const SuburbCoordinate = require("../Models/SuburbCoordinateSchema");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports.jobDetails = async (req, res) => {
  try {
    const { jobId, pickupAdd, deliveryAdd } = req.body;

    const newObj = {
      jobId,
      pickupAddress: pickupAdd,
      deliveryAddress: deliveryAdd,
    };

    const newBooking = new Booking(newObj);
    newBooking.save();

    const pickupSuburbData = await SuburbCoordinate.find({ name: pickupAdd });

    const { latitude: pickupLatitude, longitude: pickupLongitude } =
      pickupSuburbData[0] || {};

    const deliverySuburbData = await SuburbCoordinate.find({
      name: deliveryAdd,
    });

    const { latitude: deliveryLatitude, longitude: deliveryLongitude } =
      deliverySuburbData[0] || {};

    fetch("http://localhost:8001/api/v1/job-coordinates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupLatitude,
        pickupLongitude,
        deliveryLatitude,
        deliveryLongitude,
      }),
    });

    res.json({
      msg: "Request Received!",
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

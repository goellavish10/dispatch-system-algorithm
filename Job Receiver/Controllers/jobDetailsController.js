const Booking = require("../Models/JobDetailsSchema");
const SuburbCoordinate = require("../Models/SuburbCoordinateSchema");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
module.exports.jobDetails = async (req, res) => {
  try {
    const {
      jobId,
      pickupAdd,
      deliveryAdd,
      serviceCode,
      length,
      height,
      width,
    } = req.body;

    const pickupSuburbData = await SuburbCoordinate.find({ name: pickupAdd });

    const { latitude: pickupLatitude, longitude: pickupLongitude } =
      pickupSuburbData[0] || {};

    const deliverySuburbData = await SuburbCoordinate.find({
      name: deliveryAdd,
    });

    const { latitude: deliveryLatitude, longitude: deliveryLongitude } =
      deliverySuburbData[0] || {};

    const newObj = {
      jobId,
      pickupAddress: pickupAdd,
      deliveryAddress: deliveryAdd,
      serviceCode,
      itemDimensions: {
        length,
        height,
        width,
      },
    };

    const newBooking = new Booking(newObj);
    await newBooking.save();

    const dataObj = {
      pickupLatitude,
      pickupLongitude,
      deliveryLatitude,
      deliveryLongitude,
      length,
      height,
      width,
      bookingId: newBooking._id,
      serviceCode,
    };

    const response = await fetch(
      "http://localhost:8001/api/v1/job-coordinates",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      }
    );

    const data = await response.json();

    console.log(newBooking);

    res.json({
      msg: "Job booked",
      data,
    });
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

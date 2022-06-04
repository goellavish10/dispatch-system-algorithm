const Booking = require("../Models/JobDetailsSchema");
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
  } catch (err) {
    console.log(err);
    res.json({ msg: err });
  }
};

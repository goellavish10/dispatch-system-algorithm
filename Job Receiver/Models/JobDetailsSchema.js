const mongoose = require("mongoose");
const booking = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Booking = mongoose.model("booking", booking);

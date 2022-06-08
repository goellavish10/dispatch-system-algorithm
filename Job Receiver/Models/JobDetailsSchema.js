const mongoose = require("mongoose");
const booking = new mongoose.Schema(
  {
    jobId: {
      type: Number,
      required: true,
      unique: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    serviceCode: {
      type: String,
    },
    itemDimensions: {
      length: {
        type: Number,
      },
      height: {
        type: Number,
      },
      width: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

module.exports = Booking = mongoose.model("booking", booking);

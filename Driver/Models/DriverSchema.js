const mongoose = require("mongoose");
const driverLocation = new mongoose.Schema(
  {
    driverId: {
      type: Number,
      required: true,
    },
    currentLocation: {
      type: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    headingLocation: {
      type: {
        type: String,
      },
      coordinates: {
        type: [Number],
      },
    },
    vehicleType: {
      type: String,
    },
    vehicleDetail: {
      VEHICLE: {
        type: String,
        required: true,
      },
      MAX_WEIGHT: {
        type: Number,
        required: true,
      },
      MAX_LENGTH: {
        type: Number,
        required: true,
      },
      MAX_HEIGHT: {
        type: Number,
        required: true,
      },
      MAX_WIDTH: {
        type: Number,
        required: true,
      },
      PALLETS: {
        type: Number,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    activeJobs: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    availableSpace: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

driverLocation.index({
  currentLocation: "2dsphere",
});

driverLocation.index({
  headingLocation: "2dsphere",
});

driverLocation.post("save", (doc) => {
  console.log(`${doc.driverId} Function Called`);
  const {
    updateAvailableSpace,
  } = require("../middlewares/mongooseMiddlewares");
  updateAvailableSpace(doc._id);
});

driverLocation.post("find", function (result) {
  console.log(`${doc.driverId} Function Called`);
  const {
    updateAvailableSpace,
  } = require("../middlewares/mongooseMiddlewares");
  updateAvailableSpace(result._id);
});

module.exports = Driver = mongoose.model("driver", driverLocation);

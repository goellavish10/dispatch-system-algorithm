const mongoose = require("mongoose");
const serviceCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

serviceCodeSchema.index({ code: 1 }, { unique: true });

module.exports = ServiceCode = mongoose.model("serviceCode", serviceCodeSchema);

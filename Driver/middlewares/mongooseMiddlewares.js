const DriverSchema = require("../Models/DriverSchema");
const JobDetailsSchema = require("../../Job Receiver/Models/JobDetailsSchema");
module.exports.updateAvailableSpace = async (id) => {
  try {
    let driver = await DriverSchema.findById(id);
    const { MAX_HEIGHT, MAX_WIDTH, MAX_LENGTH } = driver.vehicleDetail;
    if (driver.activeJob.length === 0) {
      driver = await DriverSchema.findByIdAndUpdate(
        id,
        {
          $set: {
            availableSpace: MAX_HEIGHT * MAX_WIDTH * MAX_LENGTH,
          },
        },
        { new: true }
      );
      console.log(`${id} Document Updated!`);
      return;
    }

    let activeJobs = driver.activeJob;

    let space = 0;

    for (let i = 0; i < activeJobs.length; i++) {
      let job = await JobDetailsSchema.findById(activeJobs[i]);
      const { length, height, width } = job.itemDimensions;

      space += length * height * width;
    }

    driver = await DriverSchema.findByIdAndUpdate(
      id,
      { $set: { availableSpace: MAX_HEIGHT * MAX_WIDTH * MAX_LENGTH - space } },
      { new: true }
    );

    console.log(`${id} Document Updated!`);
  } catch (err) {
    console.log("Error in updating available space");
    console.log(err);
  }
};

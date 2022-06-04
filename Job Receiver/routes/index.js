const express = require("express");
const { writeSuburbToDatabase } = require("../Controllers/writeToDatabase");

const { jobDetails } = require("../Controllers/jobDetailsController");

const router = express.Router();

router.get("/write-suburb-to-database", writeSuburbToDatabase);
router.get("/job-details", jobDetails);
module.exports = router;

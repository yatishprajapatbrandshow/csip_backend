// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { recommendedActivityController } = require("../controller");

// get activity
router.get("/", recommendedActivityController.getReconmendedActivity);

module.exports = router;
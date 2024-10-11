// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { dashboardController } = require("../controller");

// Get major Data
router.get("/", dashboardController.getData);

router.get("/getActivity-curriculum", dashboardController.activityCurrilumn);


module.exports = router;
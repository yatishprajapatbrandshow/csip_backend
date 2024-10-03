// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { activityController } = require("../controller");

// Choose Curriculumn 
router.post("/add", activityController.addActivity);


module.exports = router;
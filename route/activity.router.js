// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { activityController } = require("../controller");

// create activity 
router.post("/add", activityController.addActivity);

// Choose Curriculumn 
router.get("/list", activityController.getActivities);

// update
router.post("/step", activityController.updateActivity);


// update
router.post("/apply", activityController.applyActivity);


module.exports = router;
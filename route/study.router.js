// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { studyController } = require("../controller");

// create Study 
router.post("/create", studyController.createStudy);

//Update Study 
router.post("/update", studyController.updateStudy);

module.exports = router;
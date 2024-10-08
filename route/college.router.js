// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { collegeController } = require("../controller");

// create activity 
router.get("/", collegeController.searchColleges);


module.exports = router;
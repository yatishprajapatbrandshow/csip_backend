// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { dashboardController } = require("../controller");

router.get("/", dashboardController.getData);


module.exports = router;
// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { userController } = require("../controller");

// Get user data  
router.post("/get", userController.findUserData);

module.exports = router;
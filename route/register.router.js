// create a router for register
const express = require("express");

const router = express.Router();

// Middleware
const { validateRequestBody } = require("../middlewares");
// Controllers
const { registerController } = require("../controller");

// register user 
router.post("/", registerController.register);

// verify Otp
router.post("/verify-otp", registerController.verifyOTP);

module.exports = router;
// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { otpController } = require("../controller");

// register user 
router.post("/send-otp", otpController.sendOTP);

// verify Otp
router.post("/verify-otp", otpController.verifyOTP);

module.exports = router;
// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { loginController } = require("../controller");

// login user with otp
router.post("/login-with-otp", loginController.loginWithOtp);
// login user with 
router.post("/login-with-email", loginController.loginWithEmail);


module.exports = router;
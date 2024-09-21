// create a router for register
const express = require("express");

const router = express.Router();

// Middleware
const { validateRequestBody } = require("../middlewares");
// Controllers
const { loginController } = require("../controller");

// login user 
router.post("/",loginController.login);


module.exports = router;
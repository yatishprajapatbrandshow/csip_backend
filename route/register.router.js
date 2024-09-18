// create a router for register
const express = require("express");

const router = express.Router();

// Middleware
const { validateRequestBody } = require("../middlewares");
// Controllers
const { registerController } = require("../controller");

router.post("/", registerController.register);

module.exports = router;
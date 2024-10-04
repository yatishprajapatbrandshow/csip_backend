// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { registerController } = require("../controller");

// register user 
router.post("/", registerController.register);
// update user
router.post("/update", registerController.updateUser);

module.exports = router;
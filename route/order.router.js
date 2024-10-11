// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { orderController } = require("../controller");

// create order 
router.post("/create", orderController.createOrder);

module.exports = router;
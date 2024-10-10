// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { paymentController } = require('../controller')

// Get Payment Pending
router.get('/pending', paymentController.getPaymentPending);


module.exports = router
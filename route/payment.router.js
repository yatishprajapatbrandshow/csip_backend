// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { paymentController } = require('../controller')

// Get Payment Pending
router.get('/pending', paymentController.getPaymentPending);

// Get Payment Pending
router.post('/create', paymentController.getPaymentPending);


module.exports = router
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    sid: {
        type: String,
        required: true
    },
    orderid: {
        type: String,
        required: true
    },
    razorpayId: {
        type: String,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    tracking_id: {
        type: String,
    },
    bank_ref_no: {
        type: String,
    },
    order_status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],  // Possible statuses
        default: 'Pending',
        required: true
    },
    failure_message: {
        type: String,
        default: null
    },
    payment_mode: {
        type: String,
        required: true
    },
    status_code: {
        type: String,
        default: null
    },
    status_message: {
        type: String,
        default: null
    },
    trans_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    addedon: {
        type: Date,
        default: Date.now
    },
    addedby: {
        type: String,
    },
    editedon: {
        type: Date,
        default: null
    },
    editedby: {
        type: String,
        default: null
    },
    deleteflag: {
        type: Boolean,
        default: false
    }
});

// Create the model
const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;

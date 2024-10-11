const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the model
const orderSchema = new Schema({
    sid: {
        type: Number,
        required: true
    },
    participantid: {  // Assuming participantId is the correct casing, but you can change it
        type: Number,
        required: true
    },
    activityid: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    voucher: {
        type: Number,
        default: 0
    },
    payementStatus: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    addedOn: {
        type: Date,
        default: Date.now  // Automatically sets the current date when a document is created
    },
    addedBy: {
        type: String,
    },
    editedOn: {
        type: Date
    },
    editedBy: {
        type: String
    },
    deleteFlag: {
        type: Boolean,
        default: false  // Indicates whether the document is deleted (soft delete)
    }
}, { timestamps: true });

// Create the model from the schema
const Order = mongoose.model('orders', orderSchema);

module.exports = Order;

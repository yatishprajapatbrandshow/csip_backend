const mongoose = require('mongoose');

// Define the User Schema
const registrationSchema = new mongoose.Schema({
    sid: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    participantpic: {
        type: String,
    },
    tshirtsize: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    aadhar_number: {
        type: Number,
    },
    type: {
        type: String,
        enum: ['Participant', 'Admin'],
        default: 'Participant',
    },
    added_by: {
        type: Number,
        default: 0,
    },
    edited_by: {
        type: Number,
        default: 0,
    },
    delete_flag: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Create and export the User model
const Registration = mongoose.model('registrations', registrationSchema);

module.exports = Registration;

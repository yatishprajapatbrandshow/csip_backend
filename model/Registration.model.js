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
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    participantpic: {
        type: String,
    },
    tshirtsize: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'],
        required: true,
    },
    aadhar_number: {
        type: Number,
        required: true,
        unique: true,
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

// models/College.js
const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true,
    },
    directorName: {
        type: String,
        required: true,
    },
    establishmentYear: {
        type: Number,
        required: true,
    },
    collegeContactNo: {
        type: String,
        required: true,
    },
    collegeEmail: {
        type: String,
        required: true,
        unique: true, // Assuming each college has a unique email
    },
    collegeWebsite: {
        type: String,
        required: true,
    },
    stream: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    collegeAddress: {
        type: String,
        required: true,
    },
    contactPersonName: {
        type: String,
        required: true,
    },
    contactPersonEmail: {
        type: String,
        required: true,
    },
    contactPersonPhone: {
        type: String,
        required: true,
    },
    contactPersonDesignation: {
        type: String,
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
        type: String,
        required: true,
    },
    collegeLogo: {
        type: String,
    },
    provisionalRegistration: {
        type: String,
    },
    finalRegistration: {
        type: String,
    },
    aboutCollege: {
        type: String,
    },
    collegeUrl: {
        type: String,
    },
    leadersMessage: {
        type: String,
    },
    embed1: {
        type: String,
    },
    embed2: {
        type: String,
    },
    embed3: {
        type: String,
    },
    eventInfo: {
        type: String,
    },
    teams: {
        type: [String], // Assuming this is an array of team names
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: true,
    },
    deleteFlag: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});

// Create a model from the schema
const College = mongoose.model('collegeinfos', collegeSchema);

// Export the model
module.exports = College;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the API Key Schema
const StudySchema = new Schema({
    sid: {
        type: Number,
        required: true
    },
    participant_id: {
        type: Number,
        required: true,
    },
    activity_id: {
        type: Number,
        required: true,
    },
    step_completed: {
        type: Array,
        default: []
    },
    score: {
        type: Number
    },
    attempt_status: {
        type: String,
        enum: ["Inprocess", "Completed"],
        default: "Inprocess"
    },
    status: {
        type: String,
        enum: ['Active', "Inactive"],
        default: "Active"
    },
    deleteflag: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create the model from the schema
const Study = mongoose.model('Study', StudySchema);

module.exports = Study;

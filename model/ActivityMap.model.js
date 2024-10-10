const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the model
const ActivityMapSchema = new Schema({
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
    topicId: {  // Assuming topicId is the correct casing
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['success', 'pending', 'failed'],  // You can define valid statuses here
        default: 'pending'

    },
    paymentMode: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'upi'],  // Define available payment modes here
    },
    referenceNo: {
        type: String,
    },
    razorpayId: {
        type: String,
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
const ActivityMap = mongoose.model('activities_maps', ActivityMapSchema);

module.exports = ActivityMap;

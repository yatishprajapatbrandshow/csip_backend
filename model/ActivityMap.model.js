const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the model
const ActivityMapSchema = new Schema({
    sid: {
        type: String,
        required: true
    },
    participantId: {  // Assuming participantId is the correct casing, but you can change it
        type: String,
        required: true
    },
    activityId: {
        type: String,
        required: true
    },
    topicId: {  // Assuming topicId is the correct casing
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],  // You can define valid statuses here
        required: true
    },
    paymentMode: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'UPI'],  // Define available payment modes here
        required: true
    },
    referenceNo: {
        type: String,
        required: true
    },
    razorpayId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    addedOn: {
        type: Date,
        default: Date.now  // Automatically sets the current date when a document is created
    },
    addedBy: {
        type: String,
        required: true
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
});

// Create the model from the schema
const ActivityMap = mongoose.model('activities_maps', ActivityMapSchema);

module.exports = ActivityMap;

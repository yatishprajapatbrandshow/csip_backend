const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the API Key Schema
const ApiKeySchema = new Schema({
    api_for: {
        type: String,
        required: true
    },
    api_keyval: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    addedon: {
        type: Date,
        default: Date.now
    },
    editedon: {
        type: Date
    },
    addedby: {
        type: String,
        required: true
    }
});

// Create the model from the schema
const ApiKey = mongoose.model('ApiKey', ApiKeySchema);

module.exports = ApiKey;

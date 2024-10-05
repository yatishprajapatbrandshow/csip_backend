// models/ActivityParticipant.js
const mongoose = require('mongoose');

// Define the schema for the ActivityParticipant
const FavouriteActivitySchema = new mongoose.Schema({
    sid: {
        type: String, // Assuming sid is a string, change it if it's a different type
        required: true,
        unique: true,
    },
    activity_id: {
        type: String, // Assuming activity_id is a string
        required: true,
    },
    participant_id: {
        type: String, // Assuming participant_id is a string
        required: true,
    },
    status: {
        type: Boolean, 
        default:true,
    },
    deleteflag: {
        type: Boolean, // Assuming deleteflag is a boolean (true or false)
        default: false, // Default value is false
    },
}, {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields automatically
});

// Create the Mongoose model
const FavouriteActivity = mongoose.model('favourite_activitie', FavouriteActivitySchema);

module.exports = FavouriteActivity;

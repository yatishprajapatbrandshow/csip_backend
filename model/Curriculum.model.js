const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for activity
const curriculumSchema = new Schema({
    sid: {
        type: Number,   // In MongoDB, this is not an auto-increment field; can be managed programmatically
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    shortname: {
        type: String,
        required: true,
    },
    short_desc: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,  // This could store a URL or a file path to the image
    },
    status: {
        type: Boolean,
        default: true  // Active by default
    },
    addedby: {
        type: String,
    },
    editedby: {
        type: String,
    },
    deleteflag: {
        type: Boolean,
        default: false  // False means item is not deleted (soft delete)
    }
}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});
// Create the activity model
module.exports = mongoose.model('curriculum', curriculumSchema);

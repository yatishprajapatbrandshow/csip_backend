const mongoose = require('mongoose');

// Define the schema for the Group
const CurriculumGroupMapSchema = new mongoose.Schema({
    sid: {
        type: Number,
        required: true,
        unique: true,  // Ensure unique SID
    },
    curriculum_sid: {
        type: Number,
        required: true,  // Assuming this is the reference to a curriculum SID
    },
    group_name: {
        type: String,
        required: true,  // Group name is required
        trim: true,
    },
    status: {
        type: Boolean,
        default: true,   // Default status is true (active)
    },
    addedby: {
        type: String,
        required: true,  // User who added the group
    },
    editedby: {
        type: String,
        required: false, // Optional, will be updated later
    },
    deleteflag: {
        type: Boolean,
        default: false,  // Soft delete, default to false (not deleted)
    }
}, { timestamps: true });  // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('curriculum_group_map', CurriculumGroupMapSchema);
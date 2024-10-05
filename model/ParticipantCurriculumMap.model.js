const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the participant's record
const participantRecordSchema = new Schema({
    sid: {
        type: Number,
        required: true,
        unique: true,  // Ensure unique SID
    },
    participant_id: {
        type: Number, // Can be Number or String depending on your participant ID implementation
        required: true,  // Reference to participant, this field is required
    },
    curriculum_id: {
        type: Number, // Can be Number or String depending on your curriculum ID implementation
        required: true,  // Reference to curriculum, this field is required
    },
    college_id: {
        type: Number, // Can be Number or String depending on your college ID implementation
        required: true,  // Reference to college, this field is required
    },
    remark: {
        type: String,
        required: false,  // Optional remarks
    },
    tag: {
        type: [String],  // Array of strings for tags
        required: false,  // Optional tags
    },
    status: {
        type: Boolean,
        default: true,  // Default status is true (active)
    },
    addedby: {
        type: String,
        required: true,  // User who added the record
    },
    editedby: {
        type: String,  // Optional user who edited the record
    },
    deleteflag: {
        type: Boolean,
        default: false,  // Soft delete, defaults to false (not deleted)
    }
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// Create the model
module.exports = mongoose.model('participant_curriculum_map', participantRecordSchema);

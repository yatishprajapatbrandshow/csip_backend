const mongoose = require('mongoose');

// Define the schema for the Topic
const CurriculumGroupTopicMapSchema = new mongoose.Schema({
    sid: {
        type: Number,
        required: true,
        unique: true,  // Ensure SID is unique for each topic
    },
    curriculum_sid: {
        type: Number,
        required: true,  // Reference to curriculum's SID
    },
    group_sid: {
        type: Number,
        required: true,  // Reference to group's SID
    },
    topic_sid: {
        type: Number,
        required: true,  // Reference to topic's SID
    },
    status: {
        type: Number,
        default: 0,   // Status of the topic, defaults to true (active)
    },
    addedby: {
        type: String,
        required: true,  // User who added this topic
    },
    editedby: {
        type: String,  // User who last edited the topic
    },
    deleteflag: {
        type: Boolean,
        default: false,  // Soft delete, defaults to false (not deleted)
    }
}, { timestamps: true });  // Automatically adds createdAt and updatedAt timestamps

module.exports = mongoose.model('curri_group_topic_map', CurriculumGroupTopicMapSchema);

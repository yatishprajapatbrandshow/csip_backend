const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comments: {
        type: String,
        required: true,   // Comments must be provided
    },
    commentby: {
        type: Number,  // Reference to the user who made the comment
        required: true,
    },
    commentto: {
        type: Number,
        required: true,
    },
    activity_id: {
        type: Number,
        required: true,
    },
    bcs_sub_id: {
        type: Number,
    },
    addedon: {
        type: Date,
        default: Date.now,  // Automatically set the current date/time
    },
    status: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['Corporate', 'Participant'],  // Role of the person making the comment
        required: true,
    },
});

// Export the model
module.exports = mongoose.model('Comment', commentSchema);

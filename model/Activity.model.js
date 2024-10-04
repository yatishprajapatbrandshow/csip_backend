const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for activity
const activitySchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    objective: { type: String, required: true },
    case_scenario: { type: String, required: true },
    case_scenario_title: { type: String, required: true },
    corporate_hierarchy_overview: { type: String, required: true },
    tools_used: { type: String, required: true },
    job_roles_and_description: { type: String, required: true },
    snap_shot: { type: String, required: true },
    youtube_video_link: { type: Array, required: true },
    short_name: { type: String, required: true },
    note: { type: String, default: '' },
    short_desc: { type: String, default: 'No description provided' },
    description: { type: String, default: '' },
    image_assc: { type: String, default: 'default.jpg' },
    amount: { type: Number, default: 0 },
    corporate_id: { type: Number, default: null },
    topic_id: { type: Number, default: null },
    tag: { type: String, default: '' },
    entry_type: { type: String, default: 'online' },
    activity_category: { type: String, default: 'General' },
    participant_quantity: { type: Number, default: 1 },
    activity_start_date: { type: Date, required: true },
    activity_end_date: { type: Date, required: true },
    submission_start_date: { type: Date, default: null },
    submission_end_date: { type: Date, default: null },
    activity_type: { type: String, default: 'MCQ' },
    need_approval: { type: Boolean, default: false },
    addedby: { type: String, default: 'admin' },
    editedby: { type: String, default: 'admin' },
    status: { type: Number, default: 1 },
    deleteflage: { type: Number, default: 0 }
});

// Create the activity model
module.exports = mongoose.model('Activity', activitySchema);

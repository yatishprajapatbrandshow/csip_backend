const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for activity
const activitySchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    objective: { type: String, required: true },
    short_desc: { type: String, required: true, default: 'No description provided' },
    short_name: { type: String, required: true },

    case_scenario: { type: String, },
    case_scenario_title: { type: String, },
    corporate_hierarchy_overview: { type: String, },
    tools_used: { type: String, },
    job_roles_and_description: { type: String, },
    snap_shot: { type: String, },
    youtube_video_link: { type: Array, },
    note: { type: String, default: '' },
    description: { type: String, default: '' },
    image_assc: { type: String, default: 'default.jpg' },
    amount: { type: Number, default: 0 },
    corporate_id: { type: Number, default: null },
    topic_id: { type: Number, default: null },
    tag: { type: String, default: '' },
    entry_type: { type: String, default: 'online' },
    activity_category: { type: String, default: 'General' },
    participant_quantity: { type: Number, default: 1 },
    activity_start_date: { type: Date, },
    activity_end_date: { type: Date, },
    submission_start_date: { type: Date, default: null },
    submission_end_date: { type: Date, default: null },
    activity_type: { type: String, default: 'MCQ' },
    need_approval: { type: Boolean, default: false },
    addedby: { type: String, default: 'admin' },
    editedby: { type: String, default: 'admin' },
    status: { type: Number, default: 1 },
    deleteflage: { type: Number, default: 0 },
    // Params
    param1_name: {
        type: String,
        default: ""
    },
    param1_desc: {
        type: String,
        default: ""
    },
    param1_img: {
        type: String,
        default: ""
    },
    param1_link: {
        type: String,
        default: ""
    },

    param2_name: {
        type: String,
        default: ""
    },
    param2_desc: {
        type: String,
        default: ""
    },
    param2_img: {
        type: String,
        default: ""
    },
    param2_link: {
        type: String,
        default: ""
    },

    param3_name: {
        type: String,
        default: ""
    },
    param3_desc: {
        type: String,
        default: ""
    },
    param3_img: {
        type: String,
        default: ""
    },
    param3_link: {
        type: String,
        default: ""
    },

    param4_name: {
        type: String,
        default: ""
    },
    param4_desc: {
        type: String,
        default: ""
    },
    param4_img: {
        type: String,
        default: ""
    },
    param4_link: {
        type: String,
        default: ""
    },

    param5_name: {
        type: String,
        default: ""
    },
    param5_desc: {
        type: String,
        default: ""
    },
    param5_img: {
        type: String,
        default: ""
    },
    param5_link: {
        type: String,
        default: ""
    },

    param6_name: {
        type: String,
        default: ""
    },
    param6_desc: {
        type: String,
        default: ""
    },
    param6_img: {
        type: String,
        default: ""
    },
    param6_link: {
        type: String,
        default: ""
    },

    param7_name: {
        type: String,
        default: ""
    },
    param7_desc: {
        type: String,
        default: ""
    },
    param7_img: {
        type: String,
        default: ""
    },
    param7_link: {
        type: String,
        default: ""
    },

    param8_name: {
        type: String,
        default: ""
    },
    param8_desc: {
        type: String,
        default: ""
    },
    param8_img: {
        type: String,
        default: ""
    },
    param8_link: {
        type: String,
        default: ""
    },

    param9_name: {
        type: String,
        default: ""
    },
    param9_desc: {
        type: String,
        default: ""
    },
    param9_img: {
        type: String,
        default: ""
    },
    param9_link: {
        type: String,
        default: ""
    },

    param10_name: {
        type: String,
        default: ""
    },
    param10_desc: {
        type: String,
        default: ""
    },
    param10_img: {
        type: String,
        default: ""
    },
    param10_link: {
        type: String,
        default: ""
    },

    param11_name: {
        type: String,
        default: ""
    },
    param11_desc: {
        type: String,
        default: ""
    },
    param11_img: {
        type: String,
        default: ""
    },
    param11_link: {
        type: String,
        default: ""
    },

    param12_name: {
        type: String,
        default: ""
    },
    param12_desc: {
        type: String,
        default: ""
    },
    param12_img: {
        type: String,
        default: ""
    },
    param12_link: {
        type: String,
        default: ""
    },

    param13_name: {
        type: String,
        default: ""
    },
    param13_desc: {
        type: String,
        default: ""
    },
    param13_img: {
        type: String,
        default: ""
    },
    param13_link: {
        type: String,
        default: ""
    },

    param14_name: {
        type: String,
        default: ""
    },
    param14_desc: {
        type: String,
        default: ""
    },
    param14_img: {
        type: String,
        default: ""
    },
    param14_link: {
        type: String,
        default: ""
    },

    param15_name: {
        type: String,
        default: ""
    },
    param15_desc: {
        type: String,
        default: ""
    },
    param15_img: {
        type: String,
        default: ""
    },
    param15_link: {
        type: String,
        default: ""
    },

    param16_name: {
        type: String,
        default: ""
    },
    param16_desc: {
        type: String,
        default: ""
    },
    param16_img: {
        type: String,
        default: ""
    },
    param16_link: {
        type: String,
        default: ""
    },

    param17_name: {
        type: String,
        default: ""
    },
    param17_desc: {
        type: String,
        default: ""
    },
    param17_img: {
        type: String,
        default: ""
    },
    param17_link: {
        type: String,
        default: ""
    },

    param18_name: {
        type: String,
        default: ""
    },
    param18_desc: {
        type: String,
        default: ""
    },
    param18_img: {
        type: String,
        default: ""
    },
    param18_link: {
        type: String,
        default: ""
    },

    param19_name: {
        type: String,
        default: ""
    },
    param19_desc: {
        type: String,
        default: ""
    },
    param19_img: {
        type: String,
        default: ""
    },
    param19_link: {
        type: String,
        default: ""
    },

    param20_name: {
        type: String,
        default: ""
    },
    param20_desc: {
        type: String,
        default: ""
    },
    param20_img: {
        type: String,
        default: ""
    },
    param20_link: {
        type: String,
        default: ""
    }
});

// Create the activity model
module.exports = mongoose.model('Activity', activitySchema);

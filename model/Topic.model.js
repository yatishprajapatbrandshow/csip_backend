const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for topics
const topicSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    participant_id: { type: Number, required: true },
    topic: { type: String, required: true },
    major: { type: String, default: '' },
    tag: { type: String, default: '' },
    program_name: { type: String, default: '' },
    short_desc: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    status: { type: Number, default: 0 }, // 0 for inactive, 1 for active
    addedon: { type: Date, default: Date.now },
    addedby: { type: String, default: 'admin' },
    editedon: { type: Date, default: Date.now },
    editedby: { type: String, default: 'admin' },
    deleteflag: { type: Number, default: 0 } // 0 for not deleted, 1 for deleted
},{timestamps:true});

// Create the model for topics
const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const topicMapSchema = new Schema({
    sid: { type: Number, required: true, unique: true },
    topic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    participant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
    program_name: { type: String, default: '' },
    status: { type: Number, default: 1 }, 
    addedby: { type: String, default: 'admin' },
    editedby: { type: String, default: 'admin' },
    deleteflag: { type: Number, default: 0 } // 0 for not deleted, 1 for deleted
});

// Create the model for topic mapping
const TopicMap = mongoose.model('TopicMap', topicMapSchema);

module.exports = TopicMap;

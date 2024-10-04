const mongoose = require('mongoose');

// Define the Participant Schema
const UserdataSchema = new mongoose.Schema({
  participant_id: {
    type: Number,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  company_logo_r: {
    type: String, // Assuming this is a path or URL to the logo
  },
  company_logo_s: {
    type: String, // Assuming this is a path or URL to the logo
  },
  company: {
    type: String,
  },
  fathername: {
    type: String,
    required: true,
  },
  mothername: {
    type: String,
    required: true,
  },
  parentcontactno: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  tshirtsize: {
    type: String,
    enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    required: true,
  },
  aadhar_number: {
    type: String,
    required: true,
    unique: true,
  },
  highestqualification: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
  },
  addedby: {
    type: Number,
    default: 0,
  },
  editedby: {
    type: Number,
    default: 0,
  },
  deleteflag: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Create and export the Participant model
const Participant = mongoose.model('UserData', UserdataSchema);

module.exports = Participant;

const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


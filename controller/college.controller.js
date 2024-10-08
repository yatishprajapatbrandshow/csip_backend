// controllers/collegeController.js
const { College } = require('../model')

// Search Colleges
const searchColleges = async (req, res) => {
    const { name, city, stream } = req.query;

    // Build the query based on provided parameters
    const query = {};

    if (name) {
        query.collegeName = { $regex: name, $options: 'i' }; // Case-insensitive search for college name
    }

    if (city) {
        query.city = { $regex: city, $options: 'i' }; // Case-insensitive search for city
    }

    if (stream) {
        query.stream = { $regex: stream, $options: 'i' }; // Case-insensitive search for stream
    }

    try {
        const colleges = await College.find(query);
        res.status(200).json({
            status: true,
            message: 'Colleges retrieved successfully',
            data: colleges,
        });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({
            status: false,
            message: 'Error fetching colleges',
            error: error.message,
        });
    }
};

module.exports = {
    searchColleges,
};

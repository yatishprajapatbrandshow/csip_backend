// controllers/collegeController.js
const { College } = require('../model')

// Search Colleges
const searchColleges = async (req, res) => {
    const { name, city, stream, page = 1, limit = 10 } = req.query; // Get pagination parameters
    console.log(name);

    // Build the query based on provided parameters
    const query = {};

    if (name) {
        query.collegename = { $regex: name, $options: 'i' }; // Case-insensitive search for college name
    }

    if (city) {
        query.city = { $regex: city, $options: 'i' }; // Case-insensitive search for city
    }

    if (stream) {
        query.stream = { $regex: stream, $options: 'i' }; // Case-insensitive search for stream
    }

    try {
        // Convert page and limit to numbers
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        // Calculate the total number of colleges
        const totalColleges = await College.countDocuments(query);

        // Fetch colleges with pagination
        const colleges = await College.find(query)
            .skip((pageNumber - 1) * pageSize) // Skip the documents for previous pages
            .limit(pageSize); // Limit the number of documents returned

        // Calculate total pages
        const totalPages = Math.ceil(totalColleges / pageSize);

        console.log(colleges);

        res.status(200).json({
            status: true,
            message: 'Colleges retrieved successfully',
            data: colleges,
            pagination: {
                totalItems: totalColleges,
                totalPages: totalPages,
                currentPage: pageNumber,
                pageSize: pageSize,
            },
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

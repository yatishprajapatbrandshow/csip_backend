const ApiKey = require('../model/ApiKey.model'); // Import the ApiKey model

// Middleware function to validate API Key
const auth = async (req, res, next) => {
    try {
        // Step 1: Get the API key from the request headers
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(401).json({
                status: false,
                message: 'Missing Api Key',
                data: false
            });
        }

        // Step 2: Check if the API key exists in the database and is active
        const key = await ApiKey.findOne({ api_keyval: apiKey, status: true });

        if (!key) {
            return res.status(403).json({
                status: false,
                message: 'Invalid API key.',
                data: false
            });
        }

        // Step 3: If the API key is valid, proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'An error occurred while validating the API key.' + error.message,
            data: false
        });
    }
};

module.exports = auth;

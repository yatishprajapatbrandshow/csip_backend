
// Function to validate the request body
function validateRequestBody(allowedKeys, ignoreKeys = []) {
    return (req, res, next) => {
        const keysInRequest = Object.keys(req.body);

        // Filter out keys that should be ignored
        const filteredKeys = keysInRequest.filter(key => !ignoreKeys.includes(key));

        // Check for missing keys
        const missingKeys = allowedKeys.filter(key => !filteredKeys.includes(key));

        if (missingKeys.length > 0) {
            // If any required key is missing, return an error
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                missingFields: missingKeys,
                data: false
            });
        }

        // Check for unexpected keys
        const isValid = filteredKeys.every(key => allowedKeys.includes(key));

        if (!isValid) {
            // If any key is not allowed, return "Wrong JSON format"
            return res.status(400).json({
                error: 'Wrong JSON format'
            });
        }

        next(); // If valid, proceed to the next middleware/route handler
    };
}


module.exports = validateRequestBody;
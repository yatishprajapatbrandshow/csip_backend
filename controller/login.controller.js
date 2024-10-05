const { Registration } = require('../model'); // Import User model for MongoDB
const { otpService, otpServices } = require('../services'); // Import OTP services
const bcrypt = require('bcrypt');

// Login Controller
const loginWithOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    // Basic validation
    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        // Find user by mobile number in MongoDB
        const user = await Registration.findOne({ mobile: mobile });

        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally remove the password field for security
        delete user.password

        // Check if user is inactive (status = 0 means inactive)
        if (user.status === 0) {
            return res.status(403).json({ message: 'User is inactive' });
        }

        // Verify OTP using otpService
        const otpMatch = await otpServices.verifyOTP(mobile, otp);

        // If OTP is invalid, return an error
        if (otpMatch !== 1) {
            return res.status(400).json({ message: 'Invalid OTP. Login failed' });
        }

        // If all checks pass, return success response with user data
        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: user
        });

    } catch (error) {
        // Catch any errors and log for debugging
        console.error('Error during login:', error);

        // Return a generic 500 error for the client
        return res.status(500).json({ message: 'An error occurred while logging in' });
    }
};

const loginWithEmail = async (req, res) => {
    const { email, password } = req.body;

    // Basic validation for email and password
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: 'Email and password are required.',
            data: false
        });
    }

    try {
        // Find user by email in MongoDB
        const user = await Registration.findOne({ email });

        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found', data: false });
        }

        // Check if the user is inactive (status = 0 means inactive)
        if (user.status === 0) {
            return res.status(403).json({ status: false, message: 'User is inactive', data: false });
        }

        // Verify the password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If password does not match, return an error
        if (!passwordMatch) {
            return res.status(400).json({ status: false, message: 'Invalid email or password', data: false });
        }
        const { name, mobile, dob, gender, city, state, pincode, aadhar_number, tshirtsize, sid, participantpic } = user;

        // If all checks pass, return success response with user data
        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
                name,
                email,
                mobile,
                dob,
                gender,
                city,
                state,
                pincode,
                aadhar_number,
                tshirtsize,
                sid,
                participantpic
            }
        });

    } catch (error) {
        // Catch any errors and log for debugging
        console.error('Error during login:', error);

        // Return a generic 500 error for the client
        return res.status(500).json({ status: false, message: 'An error occurred while logging in', data: false });
    }
};


// Export the login function for use in routes
module.exports = { loginWithOtp, loginWithEmail };

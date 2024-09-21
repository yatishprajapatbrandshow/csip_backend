const connection = require('../connection');

const { userServices, otpServices } = require('../services')

const login = async (req, res) => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    try {
        const [rows] = await connection.query('SELECT * FROM registrations WHERE mobile = ?', [mobile]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' }); // equivalent to "exit('2')"
        }

        const user = rows[0];
        delete user.password;
        // Check if user is inactive
        if (user.status === 0) {
            return res.status(403).json({ message: 'User is inactive' }); // equivalent to "exit('3')"
        }
        // verify Otp
        const otpMatch = await otpServices.verifyOTP(mobile, otp)

        if (otpMatch !== 1) {
            return res.status(400).json({ message: 'Invalid Otp Login Failed' }); // equivalent to "exit('1')"
        }

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            data: user
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred while logging in' }); // equivalent to "exit('4')"
    }
};

module.exports = { login };

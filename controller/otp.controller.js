const { otpServices } = require('../services')

const sendOTP = async (req, res) => {
    const { mobile } = req.body;

    // Validate input
    if (!mobile ) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        const result = await otpServices.sendOTP(mobile);

        if (result) {
            return res.status(200).json({ message: 'OTP Sent successfully.' });
        } else {
            return res.status(400).json({ message: 'OTP Not Sent.' });
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({ message: 'An error occurred while sending OTP.' });
    }
}

const verifyOTP = async (req, res) => {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    try {
        const result = await otpServices.verifyOTP(mobile, otp);
        console.log(result);

        if (result === 1) {
            return res.status(200).json({ message: 'OTP verified successfully.' });
        } else {
            if (result === 2) {
                return res.status(400).json({ message: 'Mobile no. already verified' });
            }
            return res.status(400).json({ message: 'OTP not match' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'An error occurred while verifying OTP.' });
    }
};

module.exports = {
    verifyOTP,
    sendOTP
} 
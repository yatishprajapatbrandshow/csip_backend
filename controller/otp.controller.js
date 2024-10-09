const { otpServices } = require('../services'); // Assuming the otpServices handles sending and verifying OTPs

// Controller for sending OTP
const sendOTP = async (req, res) => {
    const { mobile } = req.body;

    // Validate input
    if (!mobile || mobile == "") {
        return res.status(400).json({ status: false, message: 'Mobile number is required.', data: false });
    }

    try {
        // Call the otpServices to send the OTP
        const result = await otpServices.sendOTP(mobile);

        if (result) {
            // OTP sent successfully
            return res.status(200).json({ status: true, message: 'OTP sent successfully.', data: false });
        } else {
            // Error while sending OTP
            return res.status(400).json({ status: false, message: 'OTP not sent. Please try again later.', data: false });
        }
    } catch (error) {
        // Handle any errors during the process
        console.error('Error sending OTP:', error);
        return res.status(500).json({ status: false, message: 'An error occurred while sending OTP.', data: false });
    }
};

// Controller for verifying OTP
const verifyOTP = async (req, res) => {
    const { mobile, otp } = req.body;

    // Validate input
    if (!mobile || !otp) {
        return res.status(400).json({ status: false, message: 'Mobile number and OTP are required.', data: false });
    }

    try {
        // Call the otpServices to verify the OTP
        const result = await otpServices.verifyOTP(mobile, otp);

        // OTP verification successful
        if (result === 1) {
            return res.status(200).json({ status: true, message: 'OTP verified successfully.', data: false });
        }
        // Mobile number already verified
        else if (result === 2) {
            return res.status(400).json({ status: false, message: 'Mobile number already verified.', data: false });
        }
        // OTP did not match
        else {
            return res.status(400).json({ status: false, message: 'Invalid OTP. Please try again.', data: false });
        }
    } catch (error) {
        // Handle errors during verification
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ status: false, message: 'An error occurred while verifying OTP.', data: false });
    }
};

module.exports = {
    sendOTP,
    verifyOTP
};

const axios = require('axios');

const sendOTP = async (mobile) => {
    try {
        const indiaCode = 91;

        const response = await axios.post(
            `https://control.msg91.com/api/v5/otp?template_id=${process.env.TEMPLATE_ID}&mobile=${indiaCode}${mobile}`,
            {},
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authkey': process.env.AUTH_KEYS
                }
            }
        );

        if (response.status === 200) {
            return true; // OTP sent successfully
        } else {
            return false; // Failed to send OTP
        }
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false; // Failed to send OTP
    }
};

module.exports = sendOTP;

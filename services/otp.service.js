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

        return response.status === 200;
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
};

const verifyOTP = async (mobile, otp) => {
    const AUTH_KEY = "248168A6ljwU97ogg5bf3914a";
    const india_code = 91;

    try {
        const response = await axios.post(`https://control.msg91.com/api/v5/otp/verify`, null, {
            params: {
                authkey: AUTH_KEY,
                otp: otp,
                mobile: `${india_code}${mobile}`
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        
        if (response.data.message === 'OTP verified success' && response.data.type === 'success') {
            return 1;
        } else {
            if (response.data.message === 'Mobile no. already verified') {
                return 2 // OTP verified successfully
            } else if (response.data.message === "OTP not match") {
                return 3
            }
        }
    } catch (error) {
        console.error("Error verifying OTP:", error.message);
        return 2; // OTP verification failed
    }
};

module.exports = {
    sendOTP,
    verifyOTP
}
// /controllers/registrationController.js
const { userServices, otpServices } = require('../services');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { name, email, mobile, password, r_password } = req.body;

        // Validate input fields
        if (!name || !email || !mobile || !password || !r_password) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Validate mobile number (must be 10 digits)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({ message: "Mobile number must be 10 digits long." });
        }

        // Validate email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        // Validate password (at least 5 characters)
        if (password.length < 5) {
            return res.status(400).json({ message: "Password must be at least 5 characters long." });
        }

        // Check if passwords match
        if (password !== r_password) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if the email or mobile already exists in the database
        const existingUser = await userServices.findUserByEmailOrMobile(email, mobile);
        console.log(existingUser);

        if (existingUser) {
            // If user exists but status is 0 (inactive)
            if (existingUser.status === 0) {
                return res.status(200).json({ message: "User exists but is inactive." });
            } else {
                // If user exists and is active, update user details
                const updatedData = {
                    id: existingUser.id,
                    sid: existingUser.sid,
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    mobile,
                    edited_on: new Date(),
                    status: 1,
                    type: existingUser.type,
                };

                const updateResult = await userServices.updateData(updatedData);
                if (updateResult === 1) {
                    const otpSent = await otpServices.sendOTP(mobile);
                    return res.status(200).json({ message: otpSent ? "OTP sent successfully." : "Failed to send OTP." });
                } else {
                    return res.status(500).json({ message: "Failed to update user." });
                }
            }
        } else {
            // Register new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const randomSid = await userServices.generateRandomNumber();

            const newUserData = {
                sid: randomSid,
                name,
                email,
                password: hashedPassword,
                mobile,
                type: 'Participant',
                added_by: 0,
                added_on: new Date(),
                status: 1
            };

            const insertResult = await userServices.insertData(newUserData);
            if (insertResult === 1) {
                const otpSent = await otpServices.sendOTP(mobile);
                return res.status(201).json({ message: otpSent ? "User registered and OTP sent." : "User registered but failed to send OTP." });
            } else {
                return res.status(500).json({ message: "Failed to register user." });
            }
        }

    } catch (error) {
        console.error("Error during registration: ", error);
        return res.status(500).json({ message: "An error occurred during registration." });
    }
}


module.exports = { register };
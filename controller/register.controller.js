const bcrypt = require('bcrypt');
const { otpServices, userServices } = require('../services');
const { Registration } = require('../model'); // Assuming you have a User model

// Register Controller
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

        // Check if the email or mobile already exists in MongoDB
        const existingUser = await Registration.findOne({
            $or: [{ email: email }, { mobile: mobile }]
        });

        if (existingUser) {
            // If user exists but status is 0 (inactive)
            if (existingUser.status === 0) {
                return res.status(200).json({ message: "User exists but is inactive." });
            } else {
                // If user exists and is active, update user details
                existingUser.name = name;
                existingUser.email = email;
                existingUser.password = await bcrypt.hash(password, 10);
                existingUser.mobile = mobile;
                existingUser.edited_on = new Date();
                existingUser.status = 1;

                const updatedUser = await existingUser.save();

                if (updatedUser) {
                    const otpSent = await otpServices.sendOTP(mobile);
                    return res.status(200).json({ status: true, message: otpSent ? "OTP sent successfully." : "Failed to send OTP.", data: false });
                } else {
                    return res.status(500).json({ status: false, message: "Failed to update user.", data: false });
                }
            }
        } else {
            // Register new user
            const hashedPassword = await bcrypt.hash(password, 10);

            // Fetch existing IDs from the database
            const existingSlugs = await Registration.find().select('sid');
            const existingIds = existingSlugs.map(slug => slug.page_id);
            const randomSid = await userServices.generateUniqueId(existingIds);

            const newUser = new Registration({
                sid: randomSid,
                name,
                email,
                password: hashedPassword,
                mobile,
                type: 'Participant',
                added_by: 0,
                added_on: new Date(),
                status: 1
            });

            const insertResult = await newUser.save();

            if (insertResult) {
                const otpSent = await otpServices.sendOTP(mobile);
                return res.status(201).json({ status: true, message: otpSent ? "User registered and OTP sent." : "User registered but failed to send OTP.", data: false });
            } else {
                return res.status(500).json({ status: false, message: "Failed to register user.", data: false });
            }
        }
    } catch (error) {
        console.error("Error during registration: ", error);
        return res.status(500).json({ status: false, message: "An error occurred during registration.", data: false });
    }
};
const updateUser = async (req, res) => {
    try {
        const { sid, name, email, mobile, dob, gender, city, state, pincode, participantpic, tshirtsize, aadhar_number, oldPassword, password, r_password } = req.body;

        // Validate required fields
        if (!sid) {
            return res.status(400).json({ status: false, message: "Missing required fields. sid", data: false });
        }

        // Validate email
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     return res.status(400).json({ message: "Invalid email format." });
        // }

        // // Validate mobile number (10 digits)
        // const mobileRegex = /^[0-9]{10}$/;
        // if (!mobileRegex.test(mobile)) {
        //     return res.status(400).json({ message: "Invalid mobile number." });
        // }

        // Validate password if provided
        if (password) {
            if (!oldPassword || oldPassword.trim() === "") {
                return res.status(400).json({
                    status: false, message: "Missing required fields. sid", data: false
                });
            }
            if (password.length < 5) {
                return res.status(400).json({ status: false, message: "Password must be at least 5 characters long.", data: false });
            }

            // Check if passwords match
            if (password !== r_password) {
                return res.status(400).json({ status: false, message: "Passwords do not match.", data: false });
            }
        }

        // Find user by sid
        const user = await Registration.findOne({ sid });

        if (!user) {
            return res.status(404).json({ message: "User not found.", data: false });
        }

        // Update user data
        user.name = name || user.name;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        user.dob = new Date(dob) || user.dob;
        user.gender = gender.toLowerCase() || user.gender;
        user.city = city || user.city;
        user.state = state || user.state;
        user.pincode = pincode || user.pincode;
        user.participantpic = participantpic || user.participantpic;
        user.tshirtsize = tshirtsize || user.tshirtsize;
        user.aadhar_number = aadhar_number || user.aadhar_number;

        // If password is provided, hash it and update
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Set 'edited_by' and update timestamps automatically
        user.edited_by = req.user ? req.user.id : 0; // Assuming `req.user` contains logged-in user data

        // Save the updated user
        const updatedUser = await user.save();

        if (updatedUser) {
            return res.status(200).json({ status: true, message: "User updated successfully.", data: updatedUser });
        } else {
            return res.status(500).json({ status: false, message: "Failed to update user.", data: false });
        }
    } catch (error) {
        console.error("Error updating user: ", error);
        return res.status(500).json({ status: false, message: "An error occurred during the update process.", data: false });
    }
};

const getUser = async (req, res) => {
    try {
        const { participant_id } = req.query;

        // Validate required fields
        if (!participant_id || participant_id === "") {
            return res.status(400).json({ status: false, message: "Missing required fields. participant_id", data: false });
        }

        // Find user by sid
        const user = await Registration.findOne({ sid: participant_id, status: 1 });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found.", data: false });
        }

        // Define required fields for profile completion
        const requiredFields = ['name', 'email', 'mobile', 'gender', 'dob', 'city', 'state', 'pincode', 'participantpic', 'tshirtsize', 'aadhar_number'];

        // Calculate how many fields are filled out
        const completedFields = requiredFields.filter(field => user[field] && user[field] !== "" && user[field] !== undefined && user[field] !== null).length;

        // Calculate the profile completion percentage
        const profilePercentage = Math.round((completedFields / requiredFields.length) * 100);

        // Convert Mongoose document to plain object
        const userObj = user.toObject(); // This prevents mutation of the original document
        delete userObj.password
        delete userObj.__v
        delete userObj.added_by
        delete userObj.edited_by
        delete userObj.delete_flag
        // Add profilePercentage to the user object
        userObj.profilePercentage = profilePercentage;

        // Return the user object with profilePercentage
        return res.status(200).json({ status: true, message: "User retrieved successfully.", data: userObj });

    } catch (error) {
        console.error("Error fetching user: ", error);
        return res.status(500).json({ message: "An error occurred while fetching the user." });
    }
}

module.exports = { register, updateUser, getUser };

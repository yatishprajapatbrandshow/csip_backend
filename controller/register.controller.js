const db = require('../connection')
const { sendOTP, randomNumber } = require('../services');
const bcrypt = require('bcrypt');

function getCurrentDateTime() {
    const now = new Date();

    // Extract year, month, date, hours, minutes, and seconds
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, add 1 and pad with leading zero if necessary
    const date = String(now.getDate()).padStart(2, '0'); // Pad with leading zero if necessary
    const hours = String(now.getHours()).padStart(2, '0'); // Pad with leading zero if necessary
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad with leading zero if necessary
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Pad with leading zero if necessary

    // Format the date and time as YYYY-MM-DD HH:MM:SS
    const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}

// Example usage

const register = (req, res) => {
    console.log("register controller");

    const { name, mobile, email, password, r_password } = req.body;

    // Validate form fields
    const errors = [];
    if (!name) {
        errors.push("Name is required.");
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
        errors.push("Mobile number must be 10 digits long.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Invalid email address.");
    }
    if (password.length < 5) {
        errors.push("Password must be at least 5 characters long.");
    }
    if (password !== r_password) {
        errors.push("Passwords do not match.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(' ') });
    }

    console.log("Entered");
    // Hash the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the email or mobile number already exists
    const query = 'SELECT * FROM registrations WHERE email = ? OR mobile = ? AND status = 1';

    db.query(query, [email, mobile], (err, results) => {
        console.log("Entered 1");

        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        console.log(results.length);

        if (results.length > 0) {
            // User exists, update record
            const user = results[0];

            // Update user data
            const updateData = {
                name,
                email,
                password: hashedPassword,
                mobile,
                edited_by: 0,
                edited_on: new Date(),
                status: 1
            };
            const updateQuery = `
                    UPDATE registrations
                    SET name = ?, email = ?, password = ?, mobile = ?, edited_by = ?, edited_on = ?, status = ?
                    WHERE email = ? OR mobile = ?`;

            db.query(updateQuery, [
                updateData.name,
                updateData.email,
                updateData.password,
                updateData.mobile,
                updateData.edited_by,
                updateData.edited_on,
                updateData.status,
                email,
                mobile
            ], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Update query error:', updateErr);
                    return res.status(500).json({ message: 'Update failed' });
                }

                // Send OTP
                if (sendOTP(mobile)) {
                    return res.status(200).json({ message: 'User updated and OTP sent' });
                } else {
                    return res.status(500).json({ message: 'Failed to send OTP' });
                }
            });
        }
        else {
            console.log("Entered 2");

            // User exists, update record
            const user = results[0];
            if (user.status === 0) {
                return res.status(200).json({ message: 'User is inactive' });
            }

            const newUser = {
                sid: randomNumber(),
                name,
                email,
                password: hashedPassword,
                mobile,
                dob: "",
                gender: "",
                address: "",
                about: "",
                fathername: "",
                mothername: "",
                parentcontactno: "",
                city: "",
                state: "",
                pincode: "",
                participantpic: "",
                participanturl: "",
                tshirtsize: "",
                aadhar_number: "",
                highestqualification: "",
                remark: "",
                type: 'Participant',
                added_by: 0,
                added_on: getCurrentDateTime(),
                edited_by: 0,
                edited_on: '0000-00-00 00:00:00',
                delete_flag: 0,
                status: 1
            };

            // SQL INSERT query
            const insertQuery = `
                INSERT INTO registrations (
                    sid, name, email, password, mobile, dob, gender, address, about, fathername, mothername, parentcontactno, city, state, pincode, participantpic, participanturl, tshirtsize, aadhar_number, highestqualification, remark, type, added_by, added_on, edited_by, edited_on, delete_flag, status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [
                newUser.sid,
                newUser.name,
                newUser.email,
                newUser.password,
                newUser.mobile,
                newUser.dob,
                newUser.gender,
                newUser.address,
                newUser.about,
                newUser.pic,
                newUser.fathername,
                newUser.mothername,
                newUser.parentcontactno,
                newUser.city,
                newUser.state,
                newUser.pincode,
                newUser.participantpic,
                newUser.participanturl,
                newUser.tshirtsize,
                newUser.aadhar_number,
                newUser.highestqualification,
                newUser.remark,
                newUser.type,
                newUser.added_by,
                newUser.added_on,
                newUser.edited_by,
                newUser.edited_on,
                newUser.delete_flag,
                newUser.status
            ], (insertErr, insertResult) => {

                console.log("Entered 3");

                if (insertErr) {
                    console.error('Insert query error:', insertErr);
                    return res.status(500).json({ message: 'Insert failed' });
                }
                return res.status(201).json({ message: 'User registered' });
                // Send OTP
                // if (sendOTP(mobile)) {
                //     return res.status(201).json({ message: 'User registered and OTP sent' });
                // } else {
                //     return res.status(500).json({ message: 'Failed to send OTP' });
                // }
            });
        }
    });
}
module.exports = { register };
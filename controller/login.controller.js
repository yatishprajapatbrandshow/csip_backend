const db = require('../connection');
const bcrypt = require('bcrypt');
const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        const query = 'SELECT * FROM registrations WHERE email = ?';

        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).send('Error: Database error');
            }

            if (results.length > 0) {
                const user = results[0];

                // Check if the user status is active
                if (user.status === 0) {
                    // Compare provided password with the hashed password in the database
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (isMatch) {
                        // Start user session (e.g., store user info in session or JWT)
                        // For demonstration, we will just send a success message
                        return res.status(200).send('0'); // Success: User logged in
                    } else {
                        return res.status(401).send('1'); // Error: Invalid password
                    }
                } else {
                    return res.status(403).send('3'); // Error: User status is not active
                }
            } else {
                return res.status(404).send('2'); // Error: User not found
            }
        });
    } else {
        return res.status(400).send('5'); // Error: No POST request made
    }
}

module.exports = {
    login
}
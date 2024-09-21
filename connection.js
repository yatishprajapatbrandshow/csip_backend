const mysql = require('mysql2/promise'); // Use promise version

// Create a pool of connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'csip' // Replace with your database name
});

// Export the pool for use in other modules
module.exports = pool;

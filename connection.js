const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost', // or '127.0.0.1'
    user: 'root',
    password: 'root',
    database: 'csip' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database mysql ');
});

// Don't forget to close the connection when you're done
// connection.end();
module.exports = connection;

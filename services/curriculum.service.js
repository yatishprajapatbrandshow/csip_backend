const pool = require('../connection'); // Assuming this is the connection pool

const getAll = async () => {
    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // SQL query to get all curriculums
        const [rows] = await connection.query('SELECT * FROM curriculum');

        // Release the connection back to the pool
        connection.release();

        // Return the result
        return rows;

    } catch (error) {
        console.error('Error fetching curriculums:', error);
        throw new Error('Failed to get curriculums');
    }
};

module.exports = {
    getAll,
};

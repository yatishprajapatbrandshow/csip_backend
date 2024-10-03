const connection = require('../connection');

const addActivity = async (req, res) => {
    try {
        // Extract fields from the request body
        const {
            name,
            short_name,
            note,
            short_desc,
            description,
            image_assc,
            amount,
            corporate_id,
            topic_id,
            tag,
            entry_type,
            activity_category,
            participant_quantity,
            activity_start_date,
            activity_end_date,
            submission_start_date,
            submission_end_date,
            activity_type,
            need_approval,
        } = req.body;

        // Validate required fields
        const missingFields = []; // Array to hold missing fields

        if (!name) missingFields.push('name');
        if (!short_name) missingFields.push('short_name');
        if (!activity_start_date) missingFields.push('activity_start_date');
        if (!activity_end_date) missingFields.push('activity_end_date');
        if (!corporate_id) missingFields.push('corporate_id');
        if (!topic_id) missingFields.push('topic_id');
        if (!submission_start_date) missingFields.push('submission_start_date');
        if (!submission_end_date) missingFields.push('submission_end_date');
        if (!entry_type) missingFields.push('entry_type');
        if (!activity_category) missingFields.push('activity_category');
        if (!participant_quantity) missingFields.push('participant_quantity');
        if (!activity_type) missingFields.push('activity_type');
        if (need_approval === undefined) missingFields.push('need_approval');

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
                data: false
            });
        }

        // Fetch existing IDs to ensure uniqueness
        const [existingIds] = await connection.query('SELECT sid FROM csip.activity_table;');
        const sid = await generateUniqueId(existingIds.map(item => item.sid)); // Adjusted to map to actual IDs

        // Set default values for optional fields
        const defaultValues = {
            note: note || '', // Default to an empty string if note is not provided
            short_desc: short_desc || 'No description provided', // Default description
            description: description || '', // Default to an empty string
            image_assc: image_assc || 'default.jpg', // Default image
            amount: amount || 0, // Default amount
            corporate_id: corporate_id || 0, // Default to null if not provided
            topic_id: topic_id || 0, // Default to null if not provided
            tag: tag || '', // Default to an empty string
            entry_type: entry_type || 'online', // Default entry type
            activity_category: activity_category || 'General', // Default category
            participant_quantity: participant_quantity || 1, // Default to 1 participant
            submission_start_date: submission_start_date || new Date(), // Default to null
            submission_end_date: submission_end_date || null, // Default to null
            activity_type: activity_type || 'MCQ', // Default activity type
            need_approval: need_approval !== undefined ? need_approval : false, // Default to false
            addedon: formatDate(new Date()), // Default to current date
            addedby: corporate_id || 'admin', // Default to 'admin'
            editedon: formatDate(new Date()), // Default to current date
            editedby: corporate_id || 'admin', // Default to 'admin'
            status: 1, // Default to active status
            deleteflage: 0 // Default to not deleted
        };

        // SQL query to insert a new activity
        const query = `
            INSERT INTO activity_table 
            (sid, name, short_name, note, short_desc, description, image_assc, amount, corporate_id, 
            topic_id, tag, entry_type, activity_category, participant_quantity, activity_start_date, 
            activity_end_date, submission_start_date, submission_end_date, activity_type, 
            need_approval, addeon, addedby, editedon, editedby, status, deleteflag) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
        `;

        // Values to be inserted
        const values = [
            sid,
            name,
            short_name,
            defaultValues.note,
            defaultValues.short_desc,
            defaultValues.description,
            defaultValues.image_assc,
            defaultValues.amount,
            defaultValues.corporate_id,
            defaultValues.topic_id,
            defaultValues.tag,
            defaultValues.entry_type,
            defaultValues.activity_category,
            defaultValues.participant_quantity,
            activity_start_date,
            activity_end_date,
            defaultValues.submission_start_date,
            defaultValues.submission_end_date,
            defaultValues.activity_type,
            defaultValues.need_approval,
            defaultValues.addedon,
            defaultValues.addedby,
            defaultValues.editedon,
            defaultValues.editedby,
            defaultValues.status,
            defaultValues.deleteflage
        ];

        // Log the values for debugging
        console.log('Values:', values.length);

        // Execute the query
        const [result] = await connection.query(query, values);

        // Send success response with data
        res.status(201).json({
            status: true,
            message: 'Activity added successfully',
            data: { id: result.insertId, sid } // Return the ID of the newly inserted record
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            status: false,
            message: error.message,
            data: false
        });
    }
};

// Generate unique ID function
const generateUniqueId = async (existingIds) => {
    let id;
    do {
        // Generate a random number (you can adjust the range as needed)
        id = Math.floor(Math.random() * 1000000);
    } while (existingIds.includes(id)); // Ensure the ID is unique
    return id;
};
function formatDate(date) {
    // Check if the input is a valid Date object
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error('Invalid date provided');
    }

    const year = date.getFullYear(); // Get the year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-11), pad with leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Get the day, pad with leading zero
    const hours = String(date.getHours()).padStart(2, '0'); // Get the hours, pad with leading zero
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Get the minutes, pad with leading zero
    const seconds = String(date.getSeconds()).padStart(2, '0'); // Get the seconds, pad with leading zero

    // Return the formatted date
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
module.exports = {
    addActivity
};

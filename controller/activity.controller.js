const { Activity } = require('../model')
const addActivity = async (req, res) => {
    try {
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
            need_approval
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

        // Generate a unique sid
        const existingActivities = await Activity.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingActivities.map(activity => activity.sid);
        const sid = await generateUniqueId(existingIds);

        // Create new activity document
        const newActivity = new Activity({
            sid,
            name,
            short_name,
            note: note || '',
            short_desc: short_desc || 'No description provided',
            description: description || '',
            image_assc: image_assc || 'default.jpg',
            amount: amount || 0,
            corporate_id: corporate_id || 0,
            topic_id: topic_id || 0,
            tag: tag || '',
            entry_type: entry_type || 'online',
            activity_category: activity_category || 'General',
            participant_quantity: participant_quantity || 1,
            activity_start_date,
            activity_end_date,
            submission_start_date: submission_start_date || new Date(),
            submission_end_date: submission_end_date || null,
            activity_type: activity_type || 'MCQ',
            need_approval: need_approval !== undefined ? need_approval : false,
            addedon: formatDate(new Date()),
            addedby: corporate_id || 'admin',
            editedon: formatDate(new Date()),
            editedby: corporate_id || 'admin',
            status: 1,
            deleteflage: 0
        });

        // Save the new activity to the database
        const savedActivity = await newActivity.save();

        // Send success response
        res.status(201).json({
            status: true,
            message: 'Activity added successfully',
            data: { id: savedActivity._id, sid } // Return the ID of the newly inserted record
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

// Format date function
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error('Invalid date provided');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = {
    addActivity
};
const { Activity } = require('../model')
const steps = {
    2: ["case_scenario", "case_scenario_title", "description", "note"],
    3: ["corporate_hierarchy_overview", "corporate_id", "tag", "topic_id"],
    4: ["tools_used", "snap_shot", "youtube_video_link", "image_assc"],
    5: ["entry_type", "activity_category", "activity_type", "amount", "job_roles_and_description"],
    6: ["participant_quantity", "need_approval"],
    7: ["activity_start_date", "activity_end_date", "submission_start_date", "submission_end_date"],
}
// Add Activity
const addActivity = async (req, res) => {
    try {
        const {
            name,
            short_name,
            objective,
            short_desc
        } = req.body;

        // Validate required fields
        const missingFields = []; // Array to hold missing fields
        if (!name) missingFields.push('name');
        if (!short_name) missingFields.push('short_name');
        if (!objective) missingFields.push('objective');
        if (!short_desc) missingFields.push('short_desc');

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
            objective,
            short_desc,
            addedon: formatDate(new Date()),
            editedon: formatDate(new Date()),
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
// Update Activity
const updateActivity = async (req, res) => {
    try {
        const {
            step,
            _id
        } = req.body;

        // Define required fields for each step
        const steps = {
            2: ["case_scenario", "case_scenario_title", "description", "note"],
            3: ["corporate_hierarchy_overview", "corporate_id", "tag", "topic_id"],
            4: ["tools_used", "snap_shot", "youtube_video_link", "image_assc"],
            5: ["entry_type", "activity_category", "activity_type", "amount", "job_roles_and_description"],
            6: ["participant_quantity", "need_approval"],
            7: ["activity_start_date", "activity_end_date", "submission_start_date", "submission_end_date"],
        };

        // Validate step and required fields
        const requiredFields = steps[step];

        // Check if the step is valid
        if (!requiredFields) {
            return res.status(400).json({
                status: false,
                message: 'Invalid step provided.',
                data: false
            });
        }

        // Initialize array to hold missing fields
        const missingFields = requiredFields.filter(field => req.body[field] === undefined);

        // Return error if there are missing fields
        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
                data: false
            });
        }

        // Find the existing activity to update
        const activity = await Activity.findById(_id);

        // If activity is not found, return an error
        if (!activity) {
            return res.status(404).json({
                status: false,
                message: 'Activity not found.',
                data: false
            });
        }

        // Update only the fields specified in the current step
        for (const field of requiredFields) {
            if (req.body[field] !== "") {
                activity[field] = req.body[field];
            }
        }

        // Set the edited timestamp
        activity.editedon = formatDate(new Date());

        // Save the updated activity
        const updatedActivity = await activity.save();

        // Send success response
        res.status(200).json({
            status: true,
            message: 'Activity updated successfully',
            data: updatedActivity
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

// Get Activity
const getActivities = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query params

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    };

    try {
        const activities = await Activity.find({status:1})
            .skip((options.page - 1) * options.limit) // Skip the number of documents based on page
            .limit(options.limit) // Limit the number of documents returned
            .sort({ createdAt: -1 }); // Optionally sort activities

        const totalActivities = await Activity.countDocuments(); // Get total count for pagination
        const totalPages = Math.ceil(totalActivities / options.limit); // Calculate total pages

        res.status(200).json({
            status: true,
            message: 'Activities retrieved successfully',
            data: activities,
            pagination: {
                totalItems: totalActivities,
                totalPages: totalPages,
                currentPage: options.page,
                limit: options.limit
            }
        });
    } catch (error) {
        console.error(error);
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
    addActivity,
    getActivities,
    updateActivity
};
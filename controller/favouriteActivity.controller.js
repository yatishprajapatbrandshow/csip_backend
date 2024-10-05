const { FavouriteActivity } = require('../model');
const generateUniqueId = require('../utils/randomSidGenerate.util')

const ToggleFavourite = async (req, res) => {
    try {
        const { activity_id, participant_id } = req.body;

        // Check if an activity already exists with the given activity_id, participant_id, deleteflag=false
        const existing = await FavouriteActivity.findOne({
            activity_id,
            participant_id,
            deleteflag: false, // Ensure the record isn't marked as deleted
        });

        // If it exists, toggle its status
        if (existing) {
            existing.status = !existing.status; // Toggle status
            await existing.save(); // Save the updated document
            return res.status(200).json({
                status: true,
                message: 'Toggled Favourite Activity',
                data: existing,
            });
        }

        // Generate a unique sid for a new activity if it doesn't exist
        const existingActivities = await FavouriteActivity.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingActivities.map(activity => activity.sid);
        const sid = await generateUniqueId(existingIds); // Generate unique sid based on existing sids

        // Create a new favourite activity if it doesn't exist
        const newActivity = new FavouriteActivity({
            sid,
            activity_id,
            participant_id,
            status: true, // New entry, so status is true
            deleteflag: false, // Default deleteflag to false if not provided
        });

        await newActivity.save(); // Save the new activity
        res.status(201).json({
            status: true,
            message: 'New favourite activity added.',
            activity: newActivity,
        });

    } catch (error) {
        // Handle any errors during the process
        console.error('Error toggling favourite:', error);
        res.status(500).json({ status: false, message: 'Failed To Favourite Activity', data: false });
    }
};
const getAllFavouritesForUser = async (req, res) => {
    try {
        const { participant_id } = req.query;
        if(!participant_id){
            return res.status(400).json({ status: false, message: 'missing', data: false });
        }

        // Find all favourite activities where status is true, deleteflag is false, and for the given participant
        const favourites = await FavouriteActivity.find({
            participant_id,
            status: true,
            deleteflag: false
        });

        if (!favourites || favourites.length === 0) {
            return res.status(404).json({ status: false, message: 'No favourite activities found for this participant.', data: false });
        }

        res.status(200).json({ status: true, message: 'Favourite Activities Retrived successfully', data: favourites });

    } catch (error) {
        // Handle any errors during the process
        console.error('Error retrieving favourite activities for user:', error);
        res.status(500).json({ status: false, message: 'Internal server error', data: false });
    }
};

module.exports = {
    ToggleFavourite,
    getAllFavouritesForUser
}


const { Activity, TopicMap } = require('../model')


const getReconmendedActivity = async (req, res) => {
    try {
        const { participant_id = "" } = req.query;

        const topics = await TopicMap.find({ participant_id, status: 1 });

        if (!topics || topics.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No activities found",
                data: false
            })
        }
        const topicIdsString = topics[0]?.topic_id;
        const topic_idsArray = topicIdsString.split(',');

        if (!topic_idsArray || topic_idsArray.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No activities found",
                data: false
            })
        }

        // Find activities where topic_id is in the topic_idsArray
        const activities = await Activity.find({ topic_id: { $in: topic_idsArray }, status: 1 }); // Optional: Add a status filter if necessary

        // If no activities found for the given topics
        if (!activities || activities.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No activities found",
                data: false
            });
        }

        // Return the matching activities
        res.status(200).json({
            status: true,
            message: "Recommended activities retrieved successfully",
            data: activities
        });

    } catch (error) {
        // Handle any errors during the process
        console.error('Error toggling favourite:', error);
        res.status(500).json({ status: false, message: 'Failed To Favourite Activity', data: false });
    }
}
module.exports = {
    getReconmendedActivity
}

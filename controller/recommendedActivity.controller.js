const { Activity, TopicMap } = require('../model');
const { userService } = require('../services');


const getReconmendedActivity = async (req, res) => {
    try {
        const { participant_id } = req.query;
        const checkUserExits = await userService.checkIfExits(participant_id);
        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }
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
        const topicNumbers = topic_idsArray.filter(topic => Number(topic) !== 0).map(ele => Number(ele));
        if (topicNumbers.length > 0) {
            // Find activities where topic_id is in the topic_idsArray
            const activities = await Activity.find({ topic_id: { $in: topicNumbers }, status: 1 }); // Optional: Add a status filter if necessary

            // If no activities found for the given topics
            if (!activities || activities.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: "No activities found",
                    data: false
                });
            }
            // Return the matching activities
            return res.status(200).json({
                status: true,
                message: "Recommended activities retrieved successfully",
                data: activities
            });
        }
        return res.status(404).json({
            status: false,
            message: "No activities found",
            data: false
        });

    } catch (error) {
        // Handle any errors during the process
        console.error('Error To get Recomended Activity', error);
        res.status(500).json({ status: false, message: 'Failed To Favourite Activity', data: false });
    }
}
module.exports = {
    getReconmendedActivity
}

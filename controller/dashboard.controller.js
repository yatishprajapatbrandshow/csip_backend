const { Activity, ActivityMap, Topic, TopicMap, ParticipantCurriculumMap, CurriculumGroupTopicMap } = require('../model');
const { userService } = require('../services');

const getData = async (req, res) => {
    try {
        const { participant_id } = req.query;

        const checkUserExits = await userService.checkIfExits(participant_id);
        let topicStudying;
        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }
        // All Activities Maped
        const allMappedActivities = await ActivityMap.find({ participantid: participant_id, status: { $ne: 'Inactive' } });
        const activityIds = allMappedActivities.map(activity => activity.activityid);
        const activities = await Activity.find({ sid: { $in: activityIds }, status: 1 });

        // Separate activities by status
        const completedActivityIds = [];
        const ongoingActivityIds = [];
        const submissionPendingActivityIds = [];

        // Loop through all mapped activities and categorize them by status
        allMappedActivities.forEach(activity => {
            switch (activity.status) {
                case 'Completed':
                    completedActivityIds.push(activity.activityid);
                    break;
                case 'Ongoing':
                    ongoingActivityIds.push(activity.activityid);
                    break;
                case 'SubmisionPending':
                    submissionPendingActivityIds.push(activity.activityid); // Same as 'Ongoing' based on your initial code
                    break;
                default:
                    break;
            }
        });

        // Activities maped Completed
        const activitiesCompleted = await Activity.find({ sid: { $in: completedActivityIds }, status: 1 });
        // Activities maped Ongoing
        const activitiesOngoing = await Activity.find({ sid: { $in: ongoingActivityIds }, status: 1 });
        // Activities maped Ongoing
        const activitiesSubmissionPending = await Activity.find({ sid: { $in: submissionPendingActivityIds }, status: 1 });

        // Filter All activities where paymentStatus is 'pending'
        const paymentPending = allMappedActivities.filter(activity => activity.paymentStatus === 'pending');
        const activityIdsPaymentPending = paymentPending.map(activity => activity.activityid);
        const activitiesPaymentPending = await Activity.find({ sid: { $in: activityIdsPaymentPending } });

        // Find topics that match the search query (case insensitive)
        const existingTopicMap = await TopicMap.findOne({ participant_id: participant_id, status: 1 });
        const existingTopics = existingTopicMap.topic_id.split(',');
        if (existingTopicMap) {
            topicStudying = await Topic.find({ sid: { $in: existingTopics } });
        }

        return res.status(200).json({
            status: true,
            message: 'Data Retrived Successfully',
            data: {
                topicStudying: topicStudying.length === 0 ? false : topicStudying,
                activityApplied: activities.length === 0 ? false : activities,
                paymentPending: activitiesPaymentPending.length === 0 ? false : activitiesPaymentPending,
                submissionPending: activitiesSubmissionPending.length === 0 ? false : activitiesSubmissionPending,
                ongoingActivities: activitiesOngoing.length === 0 ? false : activitiesOngoing,
                completedActivities: activitiesCompleted.length === 0 ? false : activitiesCompleted,
                totalScore: false
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error ',
            data: false
        })

    }
}
const activityCurrilumn = async (req, res) => {
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
        // Activities maped
        const activityApplied = await ActivityMap.find({ participantid: participant_id, status: 'Completed', deleteFlag: false });
        // Fetch mapped curriculums for the given participant
        const mappedCurriculums = await ParticipantCurriculumMap.find({ participant_id: participant_id, status: true, deleteflag: false });

        const curriculum_id = mappedCurriculums[0]?.curriculum_id;

        if (curriculum_id) {
            const topics = await CurriculumGroupTopicMap.find({ curriculum_sid: curriculum_id });
            const percentage = Math.round((activityApplied.length / topics.length) * 100);

            return res.status(200).json({
                status: true,
                message: 'Data Retrived Successfully',
                data: { percentage }
            })
        }

        return res.status(404).json({
            status: false,
            message: 'Data Not Found',
            data: 0
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error ',
            data: false
        })

    }
}
module.exports = {
    getData,
    activityCurrilumn
}
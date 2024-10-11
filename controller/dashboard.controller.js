const { Activity, ActivityMap, Topic, TopicMap, ParticipantCurriculumMap, CurriculumGroupTopicMap } = require('../model');
const { userService } = require('../services');

const getData = async (req, res) => {
    try {
        const { participant_id } = req.query;
        console.log(participant_id);

        const checkUserExits = await userService.checkIfExits(participant_id);
        let topicStudying;
        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }
        // Activities maped
        const activityApplied = await ActivityMap.find({ participantid: participant_id, status: 'Active' });
        const activityIds = activityApplied.map(activity => activity.activityid);
        const activities = await Activity.find({ sid: { $in: activityIds }, status: 1 });

        // Filter activities where paymentStatus is 'pending'
        const paymentPending = activityApplied.filter(activity => activity.paymentStatus === 'pending');
        const activityIdsPaymentPending = paymentPending.map(activity => activity.activityid);
        const activitiesPaymentPending = await Activity.find({ sid: { $in: activityIdsPaymentPending } });

        // Find topics that match the search query (case insensitive)
        const existingTopicMap = await TopicMap.findOne({ participant_id: participant_id, status: 1 });
        const existingTopics = existingTopicMap.topic_id.split(',');
        if (existingTopicMap) {
            topicStudying = await Topic.find({ sid: { $in: existingTopics } });
        }
        // Ongoing activities
        // const todayDate = new Date();
        // // Filter activities where today's date is before the activity's end date
        // const ongoingActivities = activities.filter(activity => {
        //     const endDate = new Date(activity?.activity_end_date);
        //     console.log(endDate);

        //     return todayDate <= endDate;
        // });

        // console.log(ongoingActivities);

        return res.status(200).json({
            status: true,
            message: 'Data Retrived Successfully',
            data: {
                topicStudying: topicStudying.length === 0 ? false : topicStudying,
                activityApplied: activities.length === 0 ? false : activities,
                paymentPending: activitiesPaymentPending.length === 0 ? false : activitiesPaymentPending,
                submissionPending: false,
                ongoingActivities: false,
                completedActivities: false,
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
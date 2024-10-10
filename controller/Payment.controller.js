const {ActivityMap, Activity } = require('../model');
const { userService } = require('../services');

const getPaymentPending = async (req, res) => {
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
        const activityApplied = await ActivityMap.find({ participantid: participant_id, status: 'Active' });
        const activityIds = activityApplied.map(activity => activity.activityid);
        const activities = await Activity.find({ sid: { $in: activityIds }, status: 1 });
     
        // Filter activities where paymentStatus is 'pending'
        const paymentPending = activityApplied.filter(activity => activity.paymentStatus === 'pending');
        const activityIdsPaymentPending = paymentPending.map(activity => activity.activityid);
        const activitiesPaymentPending = await Activity.find({ sid: { $in: activityIdsPaymentPending } });

        if (activitiesPaymentPending) {
            // Return the matching activities
            return res.status(200).json({
                status: true,
                message: "Payment Pending Found",
                data: activities
            });
        }

        return res.status(404).json({
            status: false,
            message: "No Payment Pending",
            data: false
        });

    } catch (error) {
        // Handle any errors during the process
        console.error('Error To Fetch Payment Pending', error);
        res.status(500).json({ status: false, message: 'Failed To Fetch Payment Pending', data: false });
    }
}

module.exports = {
    getPaymentPending
}
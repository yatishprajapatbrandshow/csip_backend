const { ActivityMap, Activity, Order, Payment } = require('../model');
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
const createPayment = async (req, res) => {
    try {
        const { participantId, activityId, orderid, razorpayId, paidAmount, currency, tracking_id, bank_ref_no, order_status, failure_message, payment_mode, status_code, status_message, trans_date } = req.body;

        // Validate required fields
        const missingFields = []; // Array to hold missing fields
        if (!participantId) missingFields.push('participantId');
        if (!activityId) missingFields.push('activityId');
        if (!orderid) missingFields.push('orderid');
        if (!razorpayId) missingFields.push('razorpayId');
        if (!paidAmount) missingFields.push('paidAmount');
        if (!currency) missingFields.push('currency');
        if (!order_status) missingFields.push('order_status');
        if (!payment_mode) missingFields.push('payment_mode');
        if (!trans_date) missingFields.push('trans_date');

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
                data: false
            });
        }

        const exitsOrnot = await Order.findOne({ sid: orderid, status: 'Active', deleteFlag: false });

        if (!exitsOrnot) {
            return res.status(404).json({
                status: false,
                message: 'Order id is not valid ',
                data: false
            })
        }

        const alreadyExists = await Payment.find({ orderid, status: 'Active', order_status: 'Success', deleteflag: false });

        if (alreadyExists) {
            return res.status(404).json({
                status: false,
                message: 'Payment Already Done for this OrderId',
                data: false
            })
        }
        // Generate a unique sid    
        const existingPayment = await Payment.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingPayment.map(activity => activity.sid);
        const sid = await generateUniqueId(existingIds);
        const newPayment = new Payment({
            sid,
            orderid,
            razorpayId,
            paidAmount,
            currency,
            tracking_id,
            bank_ref_no,
            order_status,
            failure_message,
            payment_mode,
            status_code,
            status_message,
            trans_date,
            status: 'Active',
        })

        const savedPayment = await newPayment.save();

        if (savedPayment) {
            const appliedActivity = await ActivityMap.findOne({ participantid: participantId, activityid: activityId, status: 'Active' });
            appliedActivity.paymentStatus = 'success'
            await appliedActivity.save();
            return res.status(201).json({
                status: true,
                message: 'New Payment Created Successfully',
                data: savedPayment
            })
        }
        return res.status(404).json({
            status: false,
            message: 'Failed to create Payment',
            data: false
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: false
        })

    }
}
module.exports = {
    getPaymentPending,
    createPayment
}
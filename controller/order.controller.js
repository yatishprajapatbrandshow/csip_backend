const { Order } = require("../model");
const { userService, activityService } = require("../services");
const generateUniqueId = require("../utils/randomSidGenerate.util");

const createOrder = async (req, res) => {
    try {
        // Extract data from the request body
        const { participantid, activityid, price, discount, voucher } = req.body;

        // Validate required fields
        const missingFields = []; // Array to hold missing fields
        if (!participantid) missingFields.push('participantid');
        if (!activityid) missingFields.push('activityid');
        if (!price) missingFields.push('price');
        // if (!discount) missingFields.push('discount');
        // if (!voucher) missingFields.push('voucher');

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: false,
                message: `Missing required fields: ${missingFields.join(', ')}.`,
                data: false
            });
        }

        const checkUserExits = await userService.checkIfExits(participantid);
        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }

        const activityExists = await activityService.checkActivityExists(activityid);
        if (!activityExists) {
            return res.status(404).json({
                status: false,
                message: "Invalid Activity Id",
                data: false
            })
        }

        // Generate a unique sid
        const existingOrderIds = await Order.find({}, 'sid');
        const existingIds = existingOrderIds.map(activityMap => activityMap.sid);
        const sid = await generateUniqueId(existingIds);
        // Create a new order using the Mongoose model
        const newOrder = new Order({
            sid,
            participantid,
            activityid,
            price,
            discount,
            voucher,
            status: 'Active',
            addedBy: participantid
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Return a success response
        res.status(201).json({
            status: true,
            message: 'Order created successfully',
            data: savedOrder
        });
    } catch (error) {
        // Return an error response if something goes wrong
        console.error('Error creating order:', error);
        res.status(500).json({
            status: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
}

module.exports = {
    createOrder
}
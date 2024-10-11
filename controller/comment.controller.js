const { Comments, Registration } = require('../model'); // Import the Comment model
const { userService } = require('../services');

const getComments = async (req, res) => {
    try {
        // Extract the required data from the request body
        const { participant_id } = req.query;

        const checkUserExits = await userService.checkIfExits(participant_id);
        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }

        const comments = await Comments.find({ commentto: participant_id, status: true });
        const responseData = await Promise.all(
            comments.map(async (ele) => {
                const userData = await Registration.find({ sid: ele.commentby, status: 1 }); // Use commentby to match sid
                return { comment: ele, registration: userData[0] };
            })
        );

        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No Comment Found ",
                data: false
            })
        }
        return res.status(200).json({
            status: true,
            message: "Comment Retrived Successfully ",
            data: responseData
        })
    } catch (error) {
        // Handle errors (e.g., validation errors, database errors)
        return res.status(500).json({ status: false, message: 'Error adding comment : ' + error.message, data: false });
    }

}

module.exports = {
    getComments,
};

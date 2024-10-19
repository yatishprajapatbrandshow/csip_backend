const { Study } = require('../model'); // Assuming Study model is in the models folder
const generateUniqueId = require('../utils/randomSidGenerate.util');

// Create a new Study record
const createStudy = async (req, res) => {
    try {
        // Extract the participant_id and activity_id from the request body (usually sent by frontend)
        const { participant_id, activity_id } = req.body;

        // Validation check if participant_id or activity_id is missing
        if (!participant_id || !activity_id) {
            return res.status(400).json({
                success: false,
                message: "participant_id and activity_id are required."
            });
        }

        const alreadyExists = await Study.findOne({ activity_id, participant_id, attempt_status: 'Inprocess' });

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Already Studying this Activity",
                data: alreadyExists
            });
        }

        // Generate a unique sid    
        const existingStudy = await Study.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingStudy.map(study => study.sid);
        const sid = await generateUniqueId(existingIds);

        // Create a new Study object
        const newStudy = new Study({
            sid,
            participant_id,
            activity_id,
            step_completed: [], // Default empty array
            attempt_status: "Inprocess", // Default value
            status: "Active", // Default value
            deleteflag: false, // Default value
        });

        // Save the new Study record to the database
        const saved = await newStudy.save();
        if (saved) {
            // Send success response
            return res.status(201).json({
                success: true,
                message: "Study created successfully.",
                data: saved
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create study",
            data: false
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};
// Update Study record
const updateStudy = async (req, res) => {
    try {
        // Extract the participant_id, activity_id, step_completed, and score from the request body
        const { participant_id, activity_id, step_completed, score } = req.body;

        // Validation check if participant_id or activity_id is missing
        if (!participant_id || !activity_id) {
            return res.status(400).json({
                success: false,
                message: "participant_id and activity_id are required."
            });
        }

        // Find the study by participant_id and activity_id (assuming a combination of both is unique)
        const study = await Study.findOne({ participant_id, activity_id, attempt_status: "Inprocess" });

        // If no study found, return an error response
        if (!study) {
            return res.status(404).json({
                success: false,
                message: "Study not found.",
                data: false
            });
        }

        // If a score is provided, update the score and mark the attempt_status as "Completed"
        if (score !== undefined) {
            study.score = score;
            study.attempt_status = "Completed";
        }

        // If step_completed is provided, ensure it's unique before updating the array
        if (step_completed) {
            // Combine the existing steps with the new step and ensure uniqueness using a Set
            study.step_completed = Array.from(new Set([...study.step_completed, step_completed]));
        }

        // Save the updated study record to the database
        const updatedStudy = await study.save();

        if (updatedStudy) {
            // Send success response
            return res.status(200).json({
                success: true,
                message: "Study updated successfully.",
                data: updatedStudy
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update Study.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


module.exports = {
    createStudy,
    updateStudy
};

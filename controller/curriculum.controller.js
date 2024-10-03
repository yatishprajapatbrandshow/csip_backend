const connection = require('../connection');
const { curriculumService } = require('../services')

const getAllCurriculumn = async (req, res) => {
    try {
        const curriculums = await curriculumService.getAll();

        // If no curriculums found, send appropriate response
        if (!curriculums || curriculums.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No curriculums found",
                data: false
            });
        }

        // Send success response with data
        res.status(200).json({
            status: true,
            message: "Curriculums retrieved successfully",
            data: curriculums
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            data: false
        });
    }
}

const chooseCurriculumn = async (req, res) => {
    try {
        const { participant_id, curriculum_id } = req.body;
        const curriculums = await curriculumService.getAll();

        res.status(200).json(curriculums);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllCurriculumn, chooseCurriculumn };

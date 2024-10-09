const { Curriculum, CurriculumGroupMap, ParticipantCurriculumMap } = require('../model');
const { userService } = require('../services');
// Assuming the model is in a `models` folder
const generateUniqueId = require('../utils/randomSidGenerate.util')

// Create a new Item
const createItem = async (req, res) => {
    try {
        const { name, shortname, short_desc, description, image, status, addedby, editedby } = req.body;

        // Validate required fields
        if (!name || !shortname) {
            return res.status(400).json({ status: false, message: "Missing Required fields", data: false });
        }

        // Check for existing item with the same SID
        const existingItem = await Item.findOne({ name, status: true });
        if (existingItem) {
            return res.status(400).json({ status: false, message: "Already exits", data: false });
        }

        // Generate a unique sid
        const existingCurriculum = await Curriculum.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingCurriculum.map(Curriculum => Curriculum.sid);
        const sid = await generateUniqueId(existingIds)
        // Create a new item instance
        const newCurriculum = new Curriculum({
            sid,
            name,
            shortname,
            short_desc,
            description,
            image,
            status,
            addedby,
            editedby
        });

        // Save to the database
        const savedCurriculum = await newCurriculum.save();
        return res.status(201).json({ status: true, message: "Curriculumn Added Successfully ", data: savedCurriculum });  // Return the newly created item

    } catch (error) {
        return res.status(500).json({ status: false, error: 'Failed to create Curriculum' + error, data: false });
    }
};

// Get a list of all items
const getItems = async (req, res) => {
    try {
        // Optional query parameters for filtering, pagination, etc.
        const { name, page = 1, limit = 10 } = req.query;  // Defaults to page 1, limit 10

        // Build a query object for filtering (e.g., by name, status)
        let query = { deleteflag: false };  // Fetch only non-deleted items

        if (name) {
            query.name = { $regex: name, $options: 'i' };  // Case-insensitive search by name
        }

        // Fetch items with pagination
        const items = await Curriculum.find(query)
            .skip((page - 1) * limit)   // Skip items for pagination
            .limit(Number(limit));      // Limit the number of items returned

        if (!items || items.length == 0) {
            return res.status(404).json({
                status: false, message: "Data Not Found", data: false
            });
        }
        // Count the total number of items matching the query
        const totalItems = await Curriculum.countDocuments(query);

        // Return the items and pagination info
        return res.status(200).json({
            status: true, message: "Data Retrived Successfully ", data: items, totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: Number(page)
        });

    } catch (error) {
        // Handle any unexpected errors
        console.log(error);

        return res.status(500).json({
            status: false, message: "Failed to fetch curriculums", data: false
        });
    }
};

// Get a single curriculum with groups and topics based on curriculum_sid
const getCurriculumDetails = async (req, res) => {
    try {
        const { curriculum_sid } = req.query;  // Accept curriculum_sid from request params

        if (!curriculum_sid) {
            return res.status(400).json({ status: false, message: "curriculum_sid is required.", data: false });
        }

        // Fetch curriculum by curriculum_sid
        const curriculum = await Curriculum.findOne({ sid: curriculum_sid, deleteflag: false });

        if (!curriculum) {
            return res.status(404).json({ status: false, message: "Curriculum not found.", data: false });
        }

        // Fetch groups and topics related to the curriculum
        const groupsWithTopics = await CurriculumGroupMap.aggregate([
            { $match: { curriculum_sid: Number(curriculum_sid), deleteflag: false } },  // Match groups by curriculum_sid
            {
                $lookup: {
                    from: 'curri_group_topic_maps',  // Collection for topics mapping
                    localField: 'sid',  // Group SID in CurriculumGroupMap
                    foreignField: 'gorup_sid',  // Group SID in CurriculumGroupTopicMap
                    as: 'topicMappings'  // Embedded array of topic mappings within the group
                }
            },
            {
                $unwind: { path: '$topicMappings', preserveNullAndEmptyArrays: true }  // Unwind the topicMappings array
            },
            {
                $lookup: {
                    from: 'topics',  // Collection for full topic details
                    localField: 'topicMappings.topic_sid',  // Match topic_sid from the topicMappings
                    foreignField: 'sid',  // The topic's sid in the Topics collection
                    as: 'topicDetails'  // Embedded array of topic details
                }
            },
            {
                $unwind: { path: '$topicDetails', preserveNullAndEmptyArrays: true }  // Unwind the topicDetails array
            },
            {
                $group: {
                    _id: '$sid',  // Group by group SID
                    groupName: { $first: '$group_name' },  // Include group name
                    groupindex: { $first: '$groupIndex' },  // Include group name
                    topics: { $push: '$topicDetails' }  // Accumulate topic details
                }
            },
            {
                $sort: { groupindex: 1 }  // Sort groups by groupIndex in ascending order (1 for ascending, -1 for descending)
            }
        ]);

        // Return the curriculum along with the groups and topics
        return res.status(200).json({
            status: true,
            message: "Curriculum details retrieved successfully",
            data: {
                curriculum,
                groups: groupsWithTopics
            }
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Failed to fetch curriculum details: " + error.message,
            data: false
        });
    }
};


// choose Curriculum
const chooseCurriculumn = async (req, res) => {
    try {
        const { participant_id, curriculum_id, college_id = 0 } = req.body;

        const checkUserExits = await userService.checkIfExits(participant_id);

        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }

        const exitingCurrilum = await Curriculum.findOne({ sid: curriculum_id, status: true })

        if (!exitingCurrilum) {
            return res.status(404).json({
                status: false, message: "Data Not Found", data: false
            });
        }

        // Check if there are existing entries for this participant
        const existingCurriculums = await ParticipantCurriculumMap.find({ participant_id });

        // If there are previous entries, update their status to 0 (inactive)
        if (existingCurriculums.length > 0) {
            await ParticipantCurriculumMap.updateMany(
                { participant_id },
                { $set: { status: false } } // Set status to 0 (inactive)
            );
        }

        const existingCurriculum = await ParticipantCurriculumMap.find({}, 'sid'); // Fetch all existing sids
        const existingIds = existingCurriculum.map(Curriculum => Curriculum.sid);
        const sid = await generateUniqueId(existingIds)

        // Create a new entry with status 1 (active)
        const newEntry = new ParticipantCurriculumMap({
            sid,                            // Random SID
            participant_id: participant_id,  // Convert to ObjectId if needed
            curriculum_id: curriculum_id,    // Convert to ObjectId if needed
            college_id,                     // College ID
            remark: '',                     // Remark (optional)
            tag: [],                        // Tag (optional), you can change this if you need it
            status: 1,                      // Status (1 means active)
            addedby: 'Participant',         // Added by (who added the entry)
            editedby: 'Participant',        // Edited by (who edited the entry, can change as per your logic)
            deleteflag: false,              // Soft delete flag, defaults to false
        });

        // Save the new entry to the database
        await newEntry.save();

        // Respond with success
        return res.status(201).json({
            status: true,
            message: "Curriculum chosen successfully",
            data: newEntry // You can return the newly created entry if needed
        });

    } catch (error) {
        console.error('Error choosing curriculum:', error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong!",
            data: false
        });
    }
};

// maped Cuuriculum
const getMappedCurriculums = async (req, res) => {
    try {
        const { participant_id } = req.query; // Get participant_id from the URL params

        const checkUserExits = await userService.checkIfExits(participant_id);

        if (!checkUserExits) {
            return res.status(404).json({
                status: false,
                message: "No User Exists with this id",
                data: false
            })
        }

        // Fetch mapped curriculums for the given participant
        const mappedCurriculums = await ParticipantCurriculumMap.find({ participant_id: participant_id, status: true, deleteflag: false });

        if (!mappedCurriculums || mappedCurriculums.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No mapped curriculums found for this participant.",
                data: []
            });
        }

        // Respond with the mapped curriculums
        return res.status(200).json({
            status: true,
            message: "Mapped curriculums retrieved successfully.",
            data: mappedCurriculums,
        });

    } catch (error) {
        console.error('Error fetching mapped curriculums:', error);
        return res.status(500).json({
            status: false,
            message: "Something went wrong while fetching mapped curriculums.",
            data: false
        });
    }
};

module.exports = {
    createItem,
    getItems,
    getCurriculumDetails,
    chooseCurriculumn,
    getMappedCurriculums
}
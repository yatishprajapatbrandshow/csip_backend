const { Topic, TopicMap } = require("../model"); // Import the Topic and TopicMap models
const { userService } = require('../services');
// Search Topics
const SearchTopics = async (req, res) => {
  try {
    const { TopicSearch } = req.body;

    // Validate input
    if (!TopicSearch) {
      return res.status(400).json({
        status: false,
        message: "TopicSearch is required.",
        data: false,
      });
    }

    // Find topics that match the search query (case insensitive)
    const topics = await Topic.find({ topic: new RegExp(TopicSearch, 'i') }).limit(10);

    if (topics.length > 0) {
      return res.status(404).json({
        status: true,
        message: "Topics found",
        data: topics,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No topics found",
        data: false,
      });
    }
  } catch (error) {
    console.error("Error in handleSearchTopics:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while searching for topics.",
      data: false,
    });
  }
};
// Search Topics
const getTopics = async (req, res) => {
  try {
    const { participant_id } = req.body;

    const checkUserExits = await userService.checkIfExits(participant_id);

    if (!checkUserExits) {
      return res.status(404).json({
        status: false,
        message: "No User Exists with this id",
        data: false
      })
    }

    // Find topics that match the search query (case insensitive)
    const existingTopicMap = await TopicMap.findOne({ participant_id: participant_id });
    const existingTopics = existingTopicMap.topic_id.split(',');

    if (existingTopicMap) {
      const topics = await Topic.find({ sid: { $in: existingTopics } });
      if (topics.length > 0) {
        return res.status(200).json({
          status: true,
          message: "Topics found",
          data: topics,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "No topics found",
          data: false,
        });
      }
    }
    return res.status(404).json({
      status: false,
      message: "No topics found",
      data: false,
    });
  } catch (error) {
    console.error("Error in handleSearchTopics:", error);
    res.status(500).json({
      status: false,
      message: "An error occurred while searching for topics.",
      data: false,
    });
  }
};

// Add Topics
const addTopics = async (req, res) => {
  try {
    const participantId = req.body.participant_id;
    const selectedTopics = req.body.TopicsList || [];
    const newTopic = req.body.TopicNew;
    const programName = req.body.program || "";

    const checkUserExits = await userService.checkIfExits(participantId);

    if (!checkUserExits) {
      return res.status(404).json({
        status: false,
        message: "No User Exists with this id",
        data: false
      })
    }

    // If the request is to add a new topic
    if (newTopic) {
      if (newTopic === "") {
        return res.status(400).json({
          status: false,
          message: "New Topic is required",
          data: false
        })
      }
      // Check if the topic already exists
      const existingTopic = await Topic.findOne({ topic: newTopic });

      if (existingTopic) {
        return res.status(400).json({
          status: false,
          message: "A topic with the same name already exists. Choose from the existing topics.",
          data: existingTopic
        });
      }

      // Generate a unique SID for the new topic
      const SIDTopic = await generateUniqueSid();
      // Create a new topic
      const newTopicDocument = new Topic({
        sid: SIDTopic,
        participant_id: participantId,
        topic: newTopic,
        program_name: programName,
        addedby: "Participant",
        status: 0,
      });

      const savedTopic = await newTopicDocument.save();

      // Add the newly created topic to the selected topics list
      selectedTopics.push(savedTopic.sid.toString());
    }

    if (selectedTopics.length > 0) {
      // Step 1: Convert selectedTopics (strings) to numbers
      const topicNumbers = selectedTopics.map(topic => Number(topic));

      // Step 2: Fetch all valid topics from the database where topic_id is in the list of topicNumbers
      const validTopics = await Topic.find({ sid: { $in: topicNumbers } });

      // Step 3: Extract the valid topic IDs as numbers
      const validTopicIds = validTopics.map(topic => topic.sid.toString());

      // Step 4: Find non-existing topics by comparing the original `selectedTopics` with the `validTopicIds`
      const nonExistingTopics = topicNumbers.filter(topic => !validTopicIds.includes(topic));

      // Check if the participant already has mapped topics
      const existingTopicMap = await TopicMap.findOne({ participant_id: participantId });
      if (existingTopicMap) {
        // Update the existing topic map
        const existingTopics = existingTopicMap.topic_id.split(',');
        // unique ids
        const mergedUniqueTopics = [...new Set([...existingTopics, ...validTopicIds])];
        const topicAdded = mergedUniqueTopics.join(',');
        // update
        existingTopicMap.topic_id = topicAdded;
        existingTopicMap.program_name = programName;
        existingTopicMap.editedon = new Date();
        const saved = await existingTopicMap.save();

        return res.status(200).json({
          status: true,
          message: "Topic mapping updated successfully",
          data: saved
        });
      } else {
        // Create a new topic map
        const topicAdded = selectedTopics.join(',');
        const newTopicMap = new TopicMap({
          sid: await generateUniqueSid(),
          topic_id: topicAdded,
          participant_id: participantId,
          program_name: programName,
          addedby: "Participant",
          status: 1,
        });

        const saved = await newTopicMap.save();

        return res.status(201).json({
          status: true,
          message: "New topic mapped successfully",
          data: saved
        });
      }
    } else {
      return res.status(400).json({
        status: false,
        message: "No topics selected",
        data: false
      });
    }

  } catch (error) {
    console.error("Error in mapping topic to user:", error);
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred. Please try again later.",
      data: false,
    });
  }
};
// Remove Topics
const removeTopics = async (req, res) => {
  try {
    const participantId = req.body.participant_id;
    const topicsToRemove = req.body.TopicsList || []; // Topics to remove

    const checkUserExits = await userService.checkIfExits(participantId);

    if (!checkUserExits) {
      return res.status(404).json({
        status: false,
        message: "No User Exists with this id",
        data: false
      })
    }

    if (topicsToRemove.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No topics selected for removal.",
        data: false,
      });
    }

    // Find the existing topic map for the participant
    const existingTopicMap = await TopicMap.findOne({ participant_id: participantId });



    if (!existingTopicMap) {
      return res.status(404).json({
        status: false,
        message: "No topic mapping found for this participant.",
        data: false,
      });
    }

    // Filter out topics to remove from the existing topic mapping
    const existingTopics = existingTopicMap.topic_id.split(',');
    // Step 2: Check if all topics to remove exist in the current topic mapping
    const nonExistentTopics = topicsToRemove.filter(
      (topicId) => !existingTopics.includes(topicId)
    );

    if (nonExistentTopics.length > 0) {
      // Step 3: If there are topics that do not exist in the mapping, return an error response
      return res.status(400).json({
        status: false,
        message: "Topics are not added",
        data: nonExistentTopics, // Return the non-existent topics
      });
    }
    const filteredTopics = existingTopics.filter(
      (topicId) => !topicsToRemove.includes(topicId)
    );
    existingTopicMap.topic_id = filteredTopics.join(',')

    await existingTopicMap.save(); // Save the changes

    return res.status(200).json({
      status: true,
      message: "Topics removed successfully",
      data: existingTopicMap, // Optional: return the remaining topics
    });
  } catch (error) {
    console.error("Error in removing topics from user:", error);
    return res.status(500).json({
      status: false,
      message: "An unexpected error occurred. Please try again later.",
      data: false,
    });
  }
};
// Function to add a new topic
// const createTopic = async (req, res) => {
//   try {
//     // Extract fields from the request body
//     const {
//       participant_id,
//       topic,
//       major,
//       tag,
//       program_name,
//       short_desc,
//       description,
//       image,
//     } = req.body;

//     // Validate required fields
//     const missingFields = []; // Array to hold missing fields
//     if (!participant_id) missingFields.push('participant_id');
//     if (!topic) missingFields.push('topic');
//     if (!major) missingFields.push('major');
//     if (!tag) missingFields.push('tag');
//     if (!program_name) missingFields.push('program_name');
//     if (!short_desc) missingFields.push('short_desc');
//     if (!description) missingFields.push('description');

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         status: false,
//         message: `Missing required fields: ${missingFields.join(', ')}.`,
//         data: false
//       });
//     }

//     const existingActivities = await Topic.find({}, 'sid'); // Fetch all existing sids
//     const existingIds = existingActivities.map(activity => activity.sid);
//     const sid = await generateUniqueSid(existingIds);
//     // Create a new topic instance
//     const newTopic = new Topic({
//       sid,
//       participant_id,
//       topic,
//       major,
//       tag,
//       program_name,
//       short_desc,
//       description,
//       image,
//       status: 1,
//       addedby: participant_id || 'admin', // Default to 'admin' if not provided
//       editedby: participant_id || 'admin'  // Default to 'admin' if not provided
//     });

//     // Save the new topic to the database
//     const savedTopic = await newTopic.save();

//     // Respond with the created topic
//     res.status(201).json({
//       status: true,
//       message: 'Topic added successfully',
//       data: savedTopic
//     });
//   } catch (error) {
//     console.error("Error adding topic:", error); // Log the error for debugging
//     res.status(500).json({
//       status: false,
//       message: 'An error occurred while adding the topic.',
//       data: false
//     });
//   }
// };
// Helper function to generate a unique SID
const generateUniqueSid = async () => {
  let sid;
  let existingTopic;

  // Loop to ensure SID is unique
  do {
    sid = Math.floor(Math.random() * 1000000); // Generate a random number for SID
    existingTopic = await Topic.findOne({ sid });
  } while (existingTopic);

  return sid;
};

module.exports = {
  SearchTopics,
  addTopics,
  removeTopics,
  getTopics
};

// create a router for register
const express = require("express");

const router = express.Router();

const { topicController } = require("../controller");

// get topic
router.post("/", topicController.SearchTopics);
// add topic
router.post("/add", topicController.addTopics);

// create Topic
router.post("/create", topicController.createTopic);

module.exports = router;

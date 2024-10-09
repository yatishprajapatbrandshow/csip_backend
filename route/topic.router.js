// create a router for register
const express = require("express");

const router = express.Router();

const { topicController } = require("../controller");

// get topic
router.post("/", topicController.SearchTopics);
// get topic
router.post("/get", topicController.getTopics);

// add topic
router.post("/add", topicController.addTopics);
// remove
router.post("/remove", topicController.removeTopics);

// create Topic
// router.post("/create", topicController.createTopic);

module.exports = router;

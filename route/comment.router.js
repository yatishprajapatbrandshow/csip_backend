// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { commentController } = require("../controller");

//Get comments
router.get("/", commentController.getComments);

module.exports = router;
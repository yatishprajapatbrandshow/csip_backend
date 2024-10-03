// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { curriculumController } = require("../controller");
console.log("Request");

// get Curriculumn 
router.get("/", curriculumController.getAllCurriculumn);

// Choose Curriculumn 
router.post("/choose", curriculumController.chooseCurriculumn);


module.exports = router;
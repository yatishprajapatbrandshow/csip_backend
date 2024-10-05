// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { curriculumController } = require("../controller");

// add 
router.post('/', curriculumController.createItem)

//get data 
router.get('/', curriculumController.getItems)
//get data details
router.get('/details', curriculumController.getCurriculumDetails);
// Choose Curriculum 
router.post('/choose', curriculumController.chooseCurriculumn)
// Choose Curriculum 
router.get('/maped-curriculum', curriculumController.getMappedCurriculums)

module.exports = router;
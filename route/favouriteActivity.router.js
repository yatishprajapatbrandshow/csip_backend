// create a router for register
const express = require("express");

const router = express.Router();

// Controllers
const { favouriteActivity } = require("../controller");

// create activity 
router.post("/", favouriteActivity.ToggleFavourite);
// get activity
router.get("/", favouriteActivity.getAllFavouritesForUser);


module.exports = router;
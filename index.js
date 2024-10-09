// index.js
require("dotenv").config();
const auth = require("./middlewares/Auth");
const express = require("express");
const db = require('./mongoConnection')
const app = express();
const cors = require("cors");
// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const { activityRouter, topicRouter, loginRouter, registerRouter, curriculumRouter, favouriteActivityRouter, otpRouter, recommendedActivityRouter, collegeRouter } = require("./route");


// Register Route
app.use("/register", registerRouter);

// login Routes
app.use("/login", loginRouter);

// OTP Routes
app.use("/otp", auth, otpRouter);

// curriculum Data Routes
app.use("/curriculum", auth, curriculumRouter);

// activity Routes
app.use("/activity", auth, activityRouter);

// Recommended Activity Routes
app.use("/recommended-activity", auth, recommendedActivityRouter);

// favourite activity Routes
app.use("/favourite-activity",auth, favouriteActivityRouter);

// topic Data Routes
app.use("/topic",auth, topicRouter);

// College Routes
app.use("/college",auth, collegeRouter);

// College Routes
// app.use("/dashboardInfo", dashboardRouter);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});

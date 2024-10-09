// index.js
require("dotenv").config();
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
app.use("/otp", otpRouter);

// User Data Routes
// app.use("/user", userRouter);

// curriculum Data Routes
app.use("/curriculum", curriculumRouter);

// activity Routes
app.use("/activity", activityRouter);

// Recommended Activity Routes
app.use("/recommended-activity", recommendedActivityRouter);

// favourite activity Routes
app.use("/favourite-activity", favouriteActivityRouter);

// topic Data Routes
app.use("/topic", topicRouter);

// College Routes
app.use("/college", collegeRouter);

// College Routes
// app.use("/dashboardInfo", dashboardRouter);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});

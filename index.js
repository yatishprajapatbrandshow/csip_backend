// index.js
require("dotenv").config();
cons = require("./middlewares/Auth");
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

const { activityRouter, topicRouter, loginRouter, registerRouter, curriculumRouter, favouriteActivityRouter, otpRouter, recommendedActivityRouter, collegeRouter,studyRouter, dashboardRouter, paymentRouter, commentRouter, orderRouter } = require("./route");

// Register Route
app.use("/register", registerRouter);

// login Routes
app.use("/login", loginRouter);

// OTP Routes
app.use("/otp", otpRouter);

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

// dashboardInfo Routes
app.use("/dashboardInfo", dashboardRouter);

// payment Routes
app.use("/payment", paymentRouter);

// comments Routes
app.use("/comments",commentRouter);

// orders Routes
app.use("/order",orderRouter);

// orders Routes
app.use("/study",studyRouter);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});

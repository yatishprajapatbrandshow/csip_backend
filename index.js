// index.js
require("dotenv").config();
const express = require("express");
const db = require('./mongoConnection')
db();
const app = express();
const cors = require("cors");
// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Health Check Route
// app.get("/health", (req, res) => {
//   res.status(200).send("OK");
// });
// const { registerRouter, loginRouter, otpRouter,userRouter,curriculumRouter,activityRouter } = require("./route");
const { activityRouter } = require("./route");

// // Register Route
// app.use("/register", registerRouter);

// // login Routes
// app.use("/login", loginRouter);

// // OTP Routes
// app.use("/otp", otpRouter);

// // User Data Routes
// app.use("/user", userRouter);

// // User Data Routes
// app.use("/curriculum", curriculumRouter);

// User Data Routes
app.use("/activity", activityRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

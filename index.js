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
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const { activityRouter } = require("./route");

// User Data Routes
app.use("/activity", activityRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});

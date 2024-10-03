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

const { activityRouter,topicRouter } = require("./route");

// User Data Routes
app.use("/activity", activityRouter);

app.use("/topic", topicRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at Port:${port}`);
});

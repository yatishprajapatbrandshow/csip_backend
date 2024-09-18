// index.js
require("dotenv").config();
const express = require("express");
const connection = require("./connection");
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
const { registerRouter } = require("./route");
// Register Route
app.use("/register", registerRouter);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

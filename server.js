const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const dbConfig = require("./setup/dbConfig");

app.use(express.json());
app.use(cors());

// initializing PORT number
const PORT = process.env.PORT || 8000;

// Database Connection
dbConfig();

const insightRoute = require("./src/api/v1/routes/insight");
const authRoute = require("./src/api/v1/routes/auth");

// Routes
app.use("/api/v1/", insightRoute);
app.use("/api/v1/", authRoute);

// default Route
app.get("/", (req, res) => {
  res.send("SuiteJat - URL Info project");
});

// Listening on PORT
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

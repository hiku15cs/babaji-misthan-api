require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http"); // Import serverless-http
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import and use routes
const milkMenRoutes = require("../Routes/milk_men"); // Adjust path based on new location
const milkEntriesRoutes = require("../Routes/milk_entries");
const chhenaEntriesRoutes = require("../Routes/chhena_entries");

app.use("/api/milk-men", milkMenRoutes);
app.use("/api/milk-entry", milkEntriesRoutes);
app.use("/api/chhena-entry",chhenaEntriesRoutes);

module.exports.handler = serverless(app); // Export as serverless function

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5001;

// Use CORS middleware
app.use(cors());
// Other middleware
app.use(express.json()); // To parse JSON request bodies

//import routes
const milkMenRoutes = require("./Routes/milk_men");
const milkEntriesRoutes = require("./Routes/milk_entries");


// Use the routes
app.use("/api/milk-men", milkMenRoutes);
app.use("/api/milk-entry", milkEntriesRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

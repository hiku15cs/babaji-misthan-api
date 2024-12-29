// chhena_entries.js
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { connectCollectionChhenaEntry, connectCollectionMilkEntry } = require("../db"); // Adjust import based on your DB setup

// Get all chhena entries
router.get("/", async (req, res) => {
  try {
    const chhenaEntriesCollection = await connectCollectionChhenaEntry();
    const chhenaEntries = await chhenaEntriesCollection.find().toArray();
    res.json(chhenaEntries);
  } catch (error) {
    console.error("Error fetching chhena entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new chhena entry
router.post("/add", async (req, res) => {
  try {
    const chhenaEntriesCollection = await connectCollectionChhenaEntry();
    const milkEntriesCollection = await connectCollectionMilkEntry();
    const { milk_man_id, cow_chhena_weight, buffalo_chhena_weight, date, advance_amount } = req.body;

    // Validate milk_man_id format
    if (!ObjectId.isValid(milk_man_id)) {
      return res.status(400).json({ message: "Invalid milk_man_id format" });
    }

    // Check if the milkman exists
    const milkman = await milkEntriesCollection.findOne({ _id: new ObjectId(milk_man_id) });
    if (!milkman) {
      return res.status(404).json({ message: "Milkman not found" });
    }

    const newEntry = {
      milk_man_id: new ObjectId(milk_man_id),
      milk_man_name: milkman.milk_man_name,
      cow_chhena_weight,
      buffalo_chhena_weight,
      date: new Date(date),
      advance_amount,
    };

    const result = await chhenaEntriesCollection.insertOne(newEntry);

    res.status(201).json({ message: "Chhena entry added successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding chhena entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit a chhena entry
router.put("/edit/:id", async (req, res) => {
  try {
    const chhenaEntriesCollection = await connectCollectionChhenaEntry();
    const { id } = req.params;
    const { cow_chhena_weight, buffalo_chhena_weight, date, advance_amount } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updatedEntry = {
      cow_chhena_weight,
      buffalo_chhena_weight,
      date: new Date(date),
      advance_amount,
    };

    const result = await chhenaEntriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEntry }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Chhena entry updated successfully" });
    } else {
      res.status(404).json({ message: "Chhena entry not found" });
    }
  } catch (error) {
    console.error("Error updating chhena entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a chhena entry
router.delete("/delete/:id", async (req, res) => {
  try {
    const chhenaEntriesCollection = await connectCollectionChhenaEntry();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await chhenaEntriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Chhena entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Chhena entry not found" });
    }
  } catch (error) {
    console.error("Error deleting chhena entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

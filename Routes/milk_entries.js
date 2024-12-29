// milk_entries.js
const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const { connectCollectionMilkEntry } = require("../db"); // Adjust import based on your DB setup

// Get all milkmen
router.get("/", async (req, res) => {
  try {
    const milkEntriesCollection = await connectCollectionMilkEntry();
    const milkEntries = await milkEntriesCollection.find().toArray();
    res.json(milkEntries);
  } catch (error) {
    console.error("Error fetching milk entries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new milk entry
router.post("/add", async (req, res) => {
  try {
    const milkEntriesCollection = await connectCollectionMilkEntry();
    const { milk_man_id, milk_man_name, buffalo_milk, cow_milk, date, advance_amount } = req.body;

    // Validate milk_man_id format
    if (!ObjectId.isValid(milk_man_id)) {
      return res.status(400).json({ message: "Invalid milk_man_id format" });
    }

    const newEntry = {
      milk_man_id: new ObjectId(milk_man_id),
      milk_man_name,
      buffalo_milk,
      cow_milk,
      date: new Date(date),
      advance_amount,
    };

    const result = await milkEntriesCollection.insertOne(newEntry);

    res.status(201).json({ message: "Milk entry added successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding milk entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a milk entry
router.post("/delete", async (req, res) => {
  try {
    const milkEntriesCollection = await connectCollectionMilkEntry();
    const { milk_man_id } = req.body;

    if (!ObjectId.isValid(milk_man_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await milkEntriesCollection.deleteOne({ _id: new ObjectId(milk_man_id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Milk Entry deleted successfully" });
    } else {
      res.status(404).json({ message: "Milk Entry not found" });
    }
  } catch (error) {
    console.error("Error deleting milk entry:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

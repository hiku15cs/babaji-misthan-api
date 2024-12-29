const express = require("express");
const router = express();
const { ObjectId } = require("mongodb");
const { connectDB } = require("../db");  // Import your `connectDB` function if it's in a separate file

// Get all milkmen
router.get("/", async (req, res) => {
  try {
    const milkMenCollection = await connectDB();
    const milkMen = await milkMenCollection.find().toArray();
    res.json(milkMen);
  } catch (error) {
    console.error("Error fetching milkmen:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new milkman
router.post("/add", async (req, res) => {
  try {
    const milkMenCollection = await connectDB();

    const { milk_man_name, milk_man_mobile, cow_milk_rate, buffalo_milk_rate } = req.body;
    const newMilkMan = { milk_man_name, milk_man_mobile, cow_milk_rate, buffalo_milk_rate };
    
    const result = await milkMenCollection.insertOne(newMilkMan);
    res.status(201).json({ message: "Milkman added successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error adding milkman:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit a milkman's details
router.post("/edit", async (req, res) => {
  try {
    const milkMenCollection = await connectDB();
    const { id, milk_man_name, milk_man_mobile, cow_milk_rate, buffalo_milk_rate } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const updateFields = {};
    if (milk_man_name) updateFields.milk_man_name = milk_man_name;
    if (milk_man_mobile) updateFields.milk_man_mobile = milk_man_mobile;
    if (cow_milk_rate) updateFields.cow_milk_rate = cow_milk_rate;
    if (buffalo_milk_rate) updateFields.buffalo_milk_rate = buffalo_milk_rate;

    const result = await milkMenCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Milkman details updated successfully" });
    } else {
      res.status(404).json({ message: "Milkman not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating milkman:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a milkman
router.post("/delete", async (req, res) => {
  try {
    const milkMenCollection = await connectDB();
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const result = await milkMenCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Milkman deleted successfully" });
    } else {
      res.status(404).json({ message: "Milkman not found" });
    }
  } catch (error) {
    console.error("Error deleting milkman:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

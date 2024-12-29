// db.js
const { MongoClient } = require("mongodb");

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

// Connect to MongoDB and get the collection
async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db();
  return db.collection("milk_men");
}

async function connectCollectionMilkEntry() {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();
    return db.collection("milk_entries");
  }

  async function connectCollectionChhenaEntry() {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();
    return db.collection("chhena_entries");
  }

module.exports = { connectDB, connectCollectionMilkEntry, connectCollectionChhenaEntry };

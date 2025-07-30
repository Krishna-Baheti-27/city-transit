// File: server/config/db.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the .env file in the /server directory
dotenv.config();

const connectDB = async () => {
  try {
    // Check if the MONGO_URI is loaded
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is not defined in your .env file");
      process.exit(1);
    }

    // Attempt to connect to the MongoDB cluster.
    // The deprecated options have been removed.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

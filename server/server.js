// File: server/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file in the /server directory
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
// Enable CORS (Cross-Origin Resource Sharing) to allow our React app to communicate with the backend
app.use(cors());
// Enable express to parse JSON bodies from incoming requests
app.use(express.json());

// A simple test route to make sure the server is running
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

// Define API routes (we will add these later)
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/routes", require("./routes/routes.js"));
app.use("/api/admin", require("./routes/admin.js"));
// Add this line in server/server.js with your other app.use() calls
app.use("/api/simpleroutes", require("./routes/simpleRoutes"));
// app.use('/api/routes', require('./routes/routes'));
// app.use('/api/alerts', require('./routes/alerts'));
// app.use('/api/admin', require('./routes/admin'));

// Define the port the server will run on
// It will use the PORT from the .env file, or default to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});

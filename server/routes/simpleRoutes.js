// File: server/routes/simpleRoutes.js

const express = require("express");
const router = express.Router();
const { findSimpleRoute } = require("../controllers/simpleRoutesController");

// @route   POST /api/simpleroutes/find
// @desc    Find a route by source and destination name
// @access  Public
router.post("/find", findSimpleRoute);

module.exports = router;

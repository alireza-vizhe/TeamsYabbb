const express = require("express");

const blogController = require("../controller/blogController");

const router = express.Router();

router.post("/send-resume", blogController.handleSendResume);

module.exports = router;
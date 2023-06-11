const express = require("express");
const router = express.Router();

const relatedController = require("../controller/RelatedController");

router.post("/sign-related", relatedController.relatedAd);

module.exports = router;
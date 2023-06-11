const mongoose = require("mongoose");

const Resume = mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String,
    },
    userId: {
        type: String,
        required: true
    },
    for: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Resume", Resume);
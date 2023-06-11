const mongoose = require("mongoose");

const Image = mongoose.Schema({
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

module.exports = mongoose.model("Image", Image);
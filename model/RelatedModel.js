const mongoose = require("mongoose");

const Related = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model("Related", Related);
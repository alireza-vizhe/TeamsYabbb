const mongoose = require("mongoose");

const Post = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "public",
        enum: ['private', 'public']
    },
    work_kind: {
        type: String,
        required: true,
        default: "full-time",
        enum: ["half-time", "full-time"]
    },
    city: {
        type: String,
        required: true
    },
    work_days: {
        type: String,
        required: true,
        default: "five-for-week",
        enum: [
            "one-for-week",
            "two-for-week",
            "there-for-week",
            "four-for-week",
            "five-for-week",
            "six-for-week",
            "all-days",
          ]
    },
    work_to: {
        type: String,
        required: true,
        default: "telecommuting",
        enum: ["in-person", "telecommuting"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true
    },
    nameImg: String,
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Post.index({name: "text"});

module.exports = mongoose.model("Post", Post);
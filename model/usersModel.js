const mongoose = require("mongoose");

const User = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 4,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 100,
  },
  userType: {
    type: String,
  },
  isAdmin: {
    type: String,
    default: false,
  },
  phone: { Number },
  age: { Number },
  address: { String },
  Expertise: {
    type: String
  },
  recieveResumes: {
    type: Array,
    default: []
  },
  name: String,
  img: {
      data: Buffer,
      contentType: String,
  },
  for: {
      type: String,
  },
  Proposal: {
    type: String,
    default: 10
  },
  sended: {
    type: Array,
    default: []
  },
  wantedP: {
    type: String,
    default: "0"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);

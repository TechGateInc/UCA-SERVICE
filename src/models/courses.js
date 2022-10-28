const mongoose = require("mongoose");
// const { boolean } = require('webidl-conversions');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  courseabrev: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  timestamps: true,
});

module.exports = mongoose.model("Course", CourseSchema);

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
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
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);

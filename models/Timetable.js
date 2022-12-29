const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  level: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },

  Monday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],

  Tuesday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],

  Wednesday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],

  Thursday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],

  Friday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Timetable", TimetableSchema);

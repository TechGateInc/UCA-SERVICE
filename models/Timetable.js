const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  class: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    }
  ],

  Monday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      time: {
        type: String,
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    },
  ],

  Tuesday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      time: {
        type: String,
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    },
  ],

  Wednesday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      time: {
        type: String,
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    },
  ],

  Thursday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      time: {
        type: String,
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    },
  ],

  Friday: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      time: {
        type: String,
        required: true,
      },
      venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
      },
    },
  ],
});

module.exports = mongoose.model("Timetable", TimetableSchema);

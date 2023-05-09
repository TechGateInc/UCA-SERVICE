const mongoose = require("mongoose");

const TimetableSchema = new mongoose.Schema(
  {
    academicYear: { type: String, required: true },
    semester: { type: Number, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        lecturer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lecturer",
        },
        timetable: [
          {
            day: { type: String, required: true },
            startTime: { type: Date },
            endTime: { type: Date },
            venue: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Venue",
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timetable", TimetableSchema);

const mongoose = require("mongoose");

const LecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecturer", LecturerSchema);

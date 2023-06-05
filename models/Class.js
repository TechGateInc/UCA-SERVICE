const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    level: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: false,
    },
    start: {
      type: Date,
      required: true,
    },
    stop: {
      type: Date,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", ClassSchema);

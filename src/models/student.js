const mongoose = require("mongoose");
// const { boolean } = require("webidl-conversions");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    level: { type: String, required: true },
    group: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    matricno: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: boolean,
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

module.exports = mongoose.model("Student", StudentSchema);

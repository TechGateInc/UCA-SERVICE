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
    department: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
    ],
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
      type: Boolean,
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

module.exports = mongoose.model("Student", StudentSchema);

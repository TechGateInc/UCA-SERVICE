const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      unique: true,
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
    ],
    level: { type: String },
    group: { type: String },
    email: {
      type: String,
      unique: true,
    },
    matricno: {
      type: String,
      unique: true,
    },
    status: {
      type: Boolean,
    },

    //   role: {
    //     type: String,
    //     enum: ["student", "lecturer", "admin"],
    //   },
    role_name: [{
        type: mongoose.Schema.ObjectId,
        ref: "Role",
    }],
    
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

module.exports = User;

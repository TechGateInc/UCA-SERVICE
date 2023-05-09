const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    level: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
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
    class: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving the student
StudentSchema.pre("save", function (next) {
  const student = this;
  bcrypt.hash(student.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    student.password = hash;
    next();
  });
});

// Verify the password against the hashed password
StudentSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = mongoose.model("Student", StudentSchema);

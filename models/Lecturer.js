const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the lecturer
LecturerSchema.pre("save", function (next) {
  const lecturer = this;
  bcrypt.hash(lecturer.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    lecturer.password = hash;
    next();
  });
});

// Verify the password against the hashed password
LecturerSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = mongoose.model("Lecturer", LecturerSchema);

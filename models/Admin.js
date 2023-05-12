const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
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
    userType: {
      type: String,
      required: true,
      default: "admin",
    },
  },
  { timestamps: true }
);
// Hash the password before saving the admin
AdminSchema.pre("save", function (next) {
  const admin = this;
  bcrypt.hash(admin.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    admin.password = hash;
    next();
  });
});

// Verify the password against the hashed password
AdminSchema.methods.verifyPassword = function (password, callback) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};
module.exports = mongoose.model("Admin", AdminSchema);

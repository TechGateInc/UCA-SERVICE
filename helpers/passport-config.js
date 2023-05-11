const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");
const LocalStrategy = require("passport-local").Strategy;

function initialize(passport) {
  // Define different local strategies for student, lecturer and admin
  passport.use(
    "student",
    new LocalStrategy({ usernameField: "matricno" }, function (
      matricno,
      password,
      done
    ) {
      Student.findOne({ matricno: matricno }, function (err, student) {
        if (err) {
          return done(err);
        }
        if (!student) {
          return done(null, false, {
            message: "Incorrect matric no or password.",
          });
        }
        student.verifyPassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect matric no or password.",
            });
          }
          return done(null, student);
        });
      });
    })
  );

  passport.use(
    "lecturer",
    new LocalStrategy({ usernameField: "email" }, function (
      email,
      password,
      done
    ) {
      Lecturer.findOne({ email: email }, function (err, lecturer) {
        if (err) {
          return done(err);
        }
        if (!lecturer) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        lecturer.verifyPassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return done(null, lecturer);
        });
      });
    })
  );

  passport.use(
    "admin",
    new LocalStrategy({ usernameField: "email" }, function (
      email,
      password,
      done
    ) {
      Lecturer.findOne({ email: email }, function (err, admin) {
        if (err) {
          return done(err);
        }
        if (!admin) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        admin.verifyPassword(password, function (err, isMatch) {
          if (err) {
            return done(err);
          }
          if (!isMatch) {
            return done(null, false, {
              message: "Incorrect email or password.",
            });
          }
          return done(null, admin);
        });
      });
    })
  );

  // Serialize and deserialize the different types of users
  passport.serializeUser(function (user, done) {
    done(null, { id: user.id, type: user.type });
  });

  passport.deserializeUser(function (obj, done) {
    var Model = getModel(obj.type);
    if (!Model) {
      return done(new Error("Invalid user type"));
    }
    Model.findById(obj.id, function (err, user) {
      done(err, user);
    });
  });

  // Helper function to get the appropriate model for a given user type
  function getModel(type) {
    switch (type) {
      case "student":
        return Student;
      case "lecturer":
        return Lecturer;
      case "admin":
        return Admin;
      default:
        return null;
    }
  }
}
module.exports = initialize;

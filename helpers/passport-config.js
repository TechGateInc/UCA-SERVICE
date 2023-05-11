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
  passport.serializeUser((user, done) => {
    done(null, { id: user._id, userType: user.userType });
  });

  passport.deserializeUser(async (obj, done) => {
    try {
      if (obj.userType === "student") {
        const student = await Student.findById(obj.id);
        return done(null, student);
      } else if (obj.userType === "lecturer") {
        const lecturer = await Lecturer.findById(obj.id);
        return done(null, lecturer);
      } else if (obj.userType === "admin") {
        const admin = await Admin.findById(obj.id);
        return done(null, admin);
      } else {
        return done(new Error("Invalid user type"));
      }
    } catch (err) {
      return done(err);
    }
  });
}

module.exports = initialize;

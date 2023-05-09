const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");

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
// RWgister Routes for each type of user
router.post("/student/register", function (req, res) {
  const student = new Student({
    name: req.body.name,
    email: req.body.email,
    level: req.body.level,
    matricno: req.body.matricno,
    password: req.body.password,
    phoneNo: req.body.phoneNo,
  });
  student.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    req.logIn(student, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      return res.redirect("/student/dashboard");
    });
  });
});

router.post("/lecturer/register", function (req, res) {
  const lecturer = new Lecturer({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  lecturer.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    req.logIn(lecturer, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      return res.redirect("/lecturer/dashboard");
    });
  });
});

router.post("/admin/register", function (req, res) {
  const admin = new Admin({
    email: req.body.email,
    password: req.body.password,
  });
  admin.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    req.logIn(admin, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send();
      }
      return res.redirect("/admin/dashboard");
    });
  });
});

// Login Routes for each type of user
router.post(
  "/student/login",
  passport.authenticate("student", {
    successRedirect: "/student/dashboard",
    failureRedirect: "/student/login",
  })
);

router.post(
  "/lecturer/login",
  passport.authenticate("lecturer", {
    successRedirect: "/lecturer/dashboard",
    failureRedirect: "/lecturer/login",
  })
);

router.post(
  "/admin/login",
  passport.authenticate("admin", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
  })
);

module.exports = (router, initialize);

const router = require("express").Router();
const Student = require("../models/Student");
const Lecturer = require("../models/Lecturer");
const Admin = require("../models/Admin");
const passport = require("passport");
const {generateAccessToken} = require("../utils/token");
const initializePassport = require("../helpers/passport-config");

const bcrypt = require("bcryptjs");
initializePassport(passport);

// Register Routes for each type of user
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
  async function (req, res) {
    try {
      const { matricno, password } = req.body;
      let state;
      console.log(matricno);

      const user = await Student.findOne({ matricno });

      const passwordCheck = await bcrypt.compare(password, user.password);

      if (!passwordCheck) {
        state = { state: "error", message: "Incorrect Password" };
        console.log("error");
      } else {
        const token = generateAccessToken(user.id);
        state = {
          state: "sucess",
          message: "Loggin Sucessfully",
          details: { user, token },
        };
        console.log("sucess",token);
      }

      console.log(user);
      res.json(state);
    } catch (err) {
      console.log(err);
    }
  },
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

module.exports = router;

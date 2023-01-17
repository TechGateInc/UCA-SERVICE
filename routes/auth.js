const router = require("express").Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const Lecturer = require("../models/Lecturer");
const passport = require("passport");
const initializePassport = require("../helpers/passport-config");
initializePassport(passport);

//REGISTER ADMIN
router.post("/adminRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password,
    });
    // console.log(newAdmin);
    const admin = await newAdmin.save();
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//REGISTER STUDENT
router.post("/studentRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newStudent = new Student({
      matricno: req.body.matricno,
      password: req.body.password,
    });
    const student = await newStudent.save();
    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//REGISTER LECTURER
router.post("/lecturerRegister", async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newLecturer = new Lecturer({
      username: req.body.username,
      password: req.body.password,
    });
    const lecturer = await newLecturer.save();
    return res.status(200).json(lecturer);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN
router.post(
  "/login",
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json(error);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    if (user) {
      return res.json(user);
    }
  })
);

//LOGOUT
router.get("/logout", (req, res) => {
  //logs-out user
  req.logout();
  //redirect
  res.redirect("/");
});

module.exports = router;

const router = require("express").Router();
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const Lecturer = require("../models/Lecturer");

//REGISTER ADMIN
router.post("/adminRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newAdmin = new Admin({
      username: req.body.username,
      password: hashedPass,
    });
    const admin = await newAdmin.save();
    return res.status(200).json(admin);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN ADMIN
router.post("/adminLogin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });
    if (!admin) {
      return res.status(400).json("Wrong credential");
    }
    const validated = await bcrypt.compare(req.body.password, admin.password);
    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }
    const { password, ...others } = admin._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//REGISTER STUDENT
router.post("/studentRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newStudent = new Student({
      matricno: req.body.matricno,
      password: hashedPass,
    });
    const student = await newStudent.save();
    return res.status(200).json(student);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN STUDENT
router.post("/studentLogin", async (req, res) => {
  try {
    const student = await Student.findOne({ matricno: req.body.matricno });
    if (!student) {
      return res.status(400).json("Wrong credential");
    }
    const validated = await bcrypt.compare(req.body.password, student.password);
    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }
    const { password, ...others } = student._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//REGISTER LECTURER
router.post("/lecturerRegister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newLecturer = new Lecturer({
      username: req.body.username,
      password: hashedPass,
    });
    const lecturer = await newLecturer.save();
    return res.status(200).json(lecturer);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//LOGIN LECTURER
router.post("/lecturerLogin", async (req, res) => {
  try {
    const lecturer = await Lecturer.findOne({ username: req.body.username });
    if (!lecturer) {
      return res.status(400).json("Wrong credential");
    }
    const validated = await bcrypt.compare(
      req.body.password,
      lecturer.password
    );
    if (!validated) {
      return res.status(400).json("Wrong credentials!");
    }
    const { password, ...others } = lecturer._doc;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

const router = require("express").Router();
const Attendance = require("../models/Course");

//CREATE ATTENDANCE
router.post("/", async (req, res) => {
  const newAttendance = new Attendance(req.body);
  try {
    const savedAttendance = await newAttendance.save();
    return res.status(200).json(savedAttendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE ATTENDANCE
router.put("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedAttendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE ATTENDANCE
router.delete("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    await attendance.delete();
    return res.status(200).json("Attendance has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ATTENDANCE
router.get("/:id", async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    return res.status(200).json(attendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL ATTENDANCE
router.get("/", async (req, res) => {
  try {
    let attendances;
    attendances = await Attendance.find();
    return res.status(200).json(attendances);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH ATTENDANCE
router.patch("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      {
        $push: req.body,
      }
    );
    return res.status(200).json(updatedAttendance);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

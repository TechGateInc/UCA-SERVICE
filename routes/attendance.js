const router = require("express").Router();
const Attendance = require("../models/Attendance");
// const Locator = require("ip2location-native");
const { IpregistryClient } = require("@ipregistry/client");
const Class = require('../models/Class');
const ipFinder = require('../utils/ipaddress');
const Venue = require("../models/Venue");

//CREATE ATTENDANCE
router.post("/", async (req, res) => {
  const newAttendance = new Attendance(req.body);

  // const location = new IpregistryClient(process.env.IP_API_KEY);

  try {
    // const user_ip = ipFinder();
    // const locator = await client.lookup(user_ip);
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

const router = require("express").Router();
const Timetable = require("../models/Timetable");

//CREATE TIMETABLE
router.post("/", async (req, res) => {
  const newTimetable = new Timetable(req.body);
  try {
    const savedTimetable = await newTimetable.save();
    return res.status(200).json(savedTimetable);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE TIMETABLE
router.put("/:id", async (req, res) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedTimetable);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE TIMETABLE
router.delete("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    await timetable.delete();
    return res.status(200).json("Timetable has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET TIMETABLE
router.get("/:id", async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    return res.status(200).json(timetable);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL TIMETABLE
router.get("/", async (req, res) => {
  try {
    let timetables;
    timetables = await Timetable.find();
    return res.status(200).json(timetables);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH TIMETABLE
router.patch("/:id", async (req, res) => {
  try {
    const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedTimetable);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
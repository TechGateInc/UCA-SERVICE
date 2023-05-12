const router = require("express").Router();
const School = require("../models/School");

//CREATE DEPARTMENT
router.post("/", async (req, res) => {
  const newSchool = new School(req.body);
  try {
    const savedSchool = await newSchool.save();
    return res.status(200).json(savedSchool);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE DEPARTMENT
router.put("/:id", async (req, res) => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedSchool);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE DEPARTMENT
router.delete("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    await school.delete();
    return res.status(200).json("School has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET DEPARTMENT
router.get("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    return res.status(200).json(school);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL DEPARTMENT
router.get("/", async (req, res) => {
  try {
    let schools;
    schools = await School.find();
    return res.status(200).json(schools);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH DEPARTMENT
router.patch("/:id", async (req, res) => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedSchool);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

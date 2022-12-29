const router = require("express").Router();
const Venue = require("../models/Venue");

//CREATE VENUE
router.post("/", async (req, res) => {
  const newVenue = new Venue(req.body);
  try {
    const savedVenue = await newVenue.save();
    return res.status(200).json(savedVenue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE VENUE
router.put("/:id", async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedVenue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE VENUE
router.delete("/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    await venue.delete();
    return res.status(200).json("Venue has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET VENUE
router.get("/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    return res.status(200).json(venue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL VENUE
router.get("/", async (req, res) => {
  try {
    let venues;
    venues = await Venue.find();
    return res.status(200).json(venues);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//PATCH VENUE
router.patch("/:id", async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, {
      $push: req.body,
    });
    return res.status(200).json(updatedVenue);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;

const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    venueType: {
      type: String,
      enum: ["physical", "online"],
      default: "physical",
      required: true,
    },
    address: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    capacity: { type: Number, required: null },
    type: {
      type: String,
      enum: ["classroom", "auditorium", "laboratory", "virtual"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", VenueSchema);

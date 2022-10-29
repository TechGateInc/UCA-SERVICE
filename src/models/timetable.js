const mongoose = require("mongoose");


const TimetableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    department:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    }],

    days: [{
        type: String,
    }],
})




module.exports = mongoose.model("Timetable", TimetableSchema);
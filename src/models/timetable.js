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

    monday: [{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        time:{
            type: String,
            required: true,
        },
    }],

    tuesday: [{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        time:{
            type: String,
            required: true,
        },
    }],

    wednesday: [{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        time:{
            type: String,
            required: true,
        },
    }],

    thursday: [{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        time:{
            type: String,
            required: true,
        },
    }],

    friday: [{
        courses:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        time:{
            type: String,
            required: true,
        },
    }],

})




module.exports = mongoose.model("Timetable", TimetableSchema);
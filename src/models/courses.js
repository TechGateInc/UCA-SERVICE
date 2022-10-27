const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');

const coursesmodel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
    timestamps: true

});

module.exports = mongoose.model('Courses', coursesmodel);
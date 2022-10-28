const mongoose = require('mongoose');
const { boolean } = require('webidl-conversions');


const studentmodel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    status: {
        type: boolean
    },
    courses: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Courses'
    },
    timestamps: true
});

module.exports = mongoose.model ('Student', studentmodel);
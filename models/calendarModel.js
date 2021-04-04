const mongoose = require('mongoose')


const calndarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true,
    },
    priority: {
        type: String,
        trim: true,
    },
    images: {
        type: Array,
        default: []
    },
}, {
    timestamps: true
})
 
module.exports = mongoose.model("calendars", calndarSchema)
const mongoose = require('mongoose')


const projectSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: true
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
    state: {
        type: String,
        trim: true,
        required: true,
        default: "progress",
    },
    type: {
        type: String,
        trim: true,
        required: true,
        default: "task",
    },
    priority: {
        type: String,
        trim: true,
        required: true,
        default: "blank",
    },
    images: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})
 
module.exports = mongoose.model("tasks", projectSchema)
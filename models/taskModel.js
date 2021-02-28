const mongoose = require('mongoose')


const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UsersInProject',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
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
        default: "In Progress",
    },
    type: {
        type: String,
        trim: true,
        required: true,
        default: "Task",
    },
    priority: {
        type: Number,
        trim: true,
        required: true,
        default: 4,
    },
    images: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Tasks", projectSchema)
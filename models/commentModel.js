const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usersinproject',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks',
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Projects", commentSchema)
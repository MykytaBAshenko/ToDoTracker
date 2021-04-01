const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    body: {
        type: String,
        required: true
    },
    whosee: {
        type: Array,
        default: []
    },
    wascreated: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("message", messageSchema)
const mongoose = require('mongoose')


const userInProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        require: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects',
        require: true
    },
    status: {
        type: String,
        trim: true
    },
    nickname: {
        type: String,
        trim: true,
    },
    whatDo: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("UsersInProject", userInProjectSchema)
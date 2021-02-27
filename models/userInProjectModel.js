const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    },
    nickname: {
        type: String,
        trim: true,
    },
    email: {
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

module.exports = mongoose.model("Users", userSchema)
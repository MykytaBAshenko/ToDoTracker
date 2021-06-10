const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    avatar: {
        type: String,
        default: "/images/defaultUser.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("users", userSchema)
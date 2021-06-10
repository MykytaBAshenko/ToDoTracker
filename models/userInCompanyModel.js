const mongoose = require('mongoose')


const userInCompanySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        require: true
    },
    status: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("usersincompany", userInCompanySchema)
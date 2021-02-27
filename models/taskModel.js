const mongoose = require('mongoose')


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    usefulLink: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    design: {
        type: String,
        default: ""
    },
    logo: {
        type: String,
        default: "/images/company-placeholder.png"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Projects", projectSchema)
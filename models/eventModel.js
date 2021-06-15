const mongoose = require('mongoose')


const eventSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
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
    cost: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true,
    },
    images: {
        type: Array,
        default: []
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    latitude: {
        type: Number,
        required: true,
        default: 0
    },
    longitude: {
        type: Number,
        required: true,
        default: 0    
    }
}, {
    timestamps: true
})
 
module.exports = mongoose.model("events", eventSchema)
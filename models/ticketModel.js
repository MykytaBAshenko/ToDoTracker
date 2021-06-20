const mongoose = require('mongoose')


const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        require: true
    },
    paymentToken: {
        type: String,
        require: true
    },
    paymentID: {
        type: String,
        require: true
    }
}, {
    timestamps: true
})
 
module.exports = mongoose.model("tickets", ticketSchema)
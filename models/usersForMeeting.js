const mongoose = require('mongoose')


const usersForMeetingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    calendars: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'calendars',
    }
}, {
    timestamps: true
})
 
module.exports = mongoose.model("usersformeeting", usersForMeetingSchema)
const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const Task = require('../models/taskModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')
const fs = require('fs');


const calendarCtrl = {
    upladImage: async() => {

    }, 
    getCalendar: async(req,res) => {
        try {
            
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}
module.exports = calendarCtrl
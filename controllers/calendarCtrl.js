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
            console.log(req.user, req.query)
            let search_task_obj = {
                $and: [ 
                    {deadline: {$gte: req.query.minTime}},
                    {deadline: {$lt: req.query.maxTime}},
                    {$or: [{state: "test"},{state: "progress"}]}
                ],
                user: mongoose.Types.ObjectId(req?.user?.id)
            }
            if(req?.query?.selected != 'all') {
                search_task_obj.project = mongoose.Types.ObjectId(req?.query?.selected)
                let tasks = await Task.find(search_task_obj).populate("project")
                res.json({success:true, tasks})
            }
            else {
                let tasks = await Task.find(search_task_obj).populate("project")
                res.json({success:true, tasks})
            }
        }
        // {age : {$lt : 19}}
        // {age : {$gte : 22}}
        //{ }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}
module.exports = calendarCtrl
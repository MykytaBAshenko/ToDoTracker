const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const Task = require('../models/taskModel')
const UsersInProject = require('../models/userInProjectModel')
const Calendar = require('../models/calendarModel')
const usersForMeeting = require('../models/usersForMeeting')
const mongoose = require('mongoose')
const fs = require('fs');


const calendarCtrl = {
    uploadImage: async (req, res) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.json({ success: false, msg: "No files were uploaded." })

            const file = req.files.file;

            if (file.size > 8 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.json({ msg: "Size too large." })
            }
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.json({ success: false, msg: "File format is incorrect." })
            }

            let new_image_name = `uploads/calendar/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err) => {

                if (err) {
                    return res.json({ success: false, msg: "Something broke." })
                }
                return res.json({ success: true, url: new_image_name })
            });
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getCalendar: async(req,res) => {
        try {
            let search_task_obj = {
                $and: [ 
                    {deadline: {$gte: req.query.minTime}},
                    {deadline: {$lt: req.query.maxTime}},
                    {$or: [{state: "test"},{state: "progress"}]}
                ],
                user: mongoose.Types.ObjectId(req?.user?.id)
            }
            let search_calendar_obj = {
                $and: [ 
                    {date: {$gte: req.query.minTime}},
                    {date: {$lt: req.query.maxTime}},
                    {$or: [{type: "blank"},{type: "reminder"},{type: "todo"}]}
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
                let calendar = await Calendar.find(search_calendar_obj)
                let meetings = await usersForMeeting.find({user: mongoose.Types.ObjectId(req.user.id)}).populate("calendars")
                let array_of_users_for_meetings = []


                for (let y = 0; y < meetings.length; y++) {
                    let push_arr = {
                        cal_id: meetings[y]._id,
                    }
                    push_arr.users = await usersForMeeting.find({calendars: meetings[y].calendars}).populate("user")
                    array_of_users_for_meetings.push(push_arr)
                }
                return res.json({success:true, tasks, calendar, meetings, array_of_users_for_meetings})
            }
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    checkIfExistEmail: async(req, res) => {
        try {
            const user = await Users.findOne({ email: req.body.email }).select('-password')
            if(user)
                return res.json({success: true, user, msg: "User exist."})
            return res.json({success: false, msg: "User does not exist."})
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    createNewCalendar: async(req, res) => {
        try {
            console.log(req.body)
            console.log(req.user)
            if(req.body.type != 'meeting') {
                const newCalendar = new Calendar({
                    user: mongoose.Types.ObjectId(req.user.id),
                    title: req.body.title,
                    description: req.body.description,
                    type: req.body.type,
                    images: req?.body?.images,
                    date: req?.body?.date,
                    priority: req.body.priority ?? null,
                })
                await newCalendar.save()
                return res.json({success: true, msg: `${req.body.type[0].toUpperCase() + req.body.type.slice(1)} was successfully created.`})
            }
            else {
                const newCalendar = new Calendar({
                    user: mongoose.Types.ObjectId(req.user.id),
                    title: req.body.title,
                    description: req.body.description,
                    type: req.body.type,
                    images: req?.body?.images,
                    date: req?.body?.date,
                    priority: null,
                })
                let new_project = await newCalendar.save()
                for(let o = 0; o < req.body.users.length; o++) {
                    const newMeetingUser = new usersForMeeting({
                        user: mongoose.Types.ObjectId(req.body.users[o]),
                        calendars: new_project._id
                    })
                    await newMeetingUser.save()
                }
                return res.json({success: true, msg: `Meeting was successfully created.`})
            }
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}
module.exports = calendarCtrl
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
    },
    getCalendarForEditing: async(req,res) => {
        try {
            let cal = await Calendar.find({_id: mongoose.Types.ObjectId(req.params.calendarId)})
            if (cal.length) {
                if(cal[0].type != 'meeting') {
                    return res.json({ success: true, calendar: cal })
                }else {
                    let users = await usersForMeeting.find({calendars: mongoose.Types.ObjectId(req.params.calendarId)}).populate("user")
                    return res.json({ success: true, calendar: cal, users }) 
                }
            }
            return res.json({ success: false, msg: "Does not exist." })
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    updateCalendar: async(req, res) => {
        try {
            let cal = await Calendar.find({_id: mongoose.Types.ObjectId(req.params.calendarId)})
            if (cal.length) {
                console.log(cal)
                if(req.body.type != 'meeting') {
                    cal[0].title = req.body.title
                    cal[0].description = req.body.description
                    cal[0].type = req.body.type
                    cal[0].images = req.body.images
                    cal[0].date = req.body.date
                    cal[0].priority = req.body.priority

                    await cal[0].save()
                    return res.json({success: true, msg: `Сalendar event has been updated.`})
                }
                else {
                    cal[0].title = req.body.title
                    cal[0].description = req.body.description
                    cal[0].type = req.body.type
                    cal[0].images = req.body.images
                    cal[0].date = req.body.date
                    cal[0].priority = null
                    await cal[0].save()
                    await usersForMeeting.deleteMany({calendars: cal[0]._id})

                    for(let o = 0; o < req.body.users.length; o++) {
                        const newMeetingUser = new usersForMeeting({
                            user: mongoose.Types.ObjectId(req.body.users[o]),
                            calendars: cal[0]._id
                        })
                        await newMeetingUser.save()
                    }
            console.log(req.body)

                    return res.json({success: true, msg: `Meeting was successfully updated.`})
                }
            }
            return res.json({ success: false, msg: "Does not exist." })
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    deleteCalendar: async(req, res) => {
        try {
            console.log(req.body)
            console.log(req.user)
            let cal = await Calendar.find({_id: mongoose.Types.ObjectId(req.params.calendarId)})
            if (cal.length) {
                if(cal[0].type == 'meeting')
                {
                    await usersForMeeting.deleteMany({calendars: cal[0]._id})
                }
                cal[0].remove()
                return res.json({success: true, msg: `Сalendar event has been updated.`})
            }
            return res.json({ success: false, msg: "Does not exist." })
        }
        catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}
module.exports = calendarCtrl
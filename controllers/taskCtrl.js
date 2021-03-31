const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const Task = require('../models/taskModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const fs = require('fs');
const projectCtrl = require('./projectCtrl')




const taskCtrl = {
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

            let new_image_name = `uploads/tasks/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err) => {

                if (err) {
                    return res.json({ success: false, msg: "Something broke." })
                }
                return res.json({ success: true, url: new_image_name })
            });
        } catch (err) {
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    createTask: async (req, res) => {
        try {
            let project = await Project.find({ uniqueLink: req.params.projectLink })
            if (project.length) {
                let users_in_project = await UsersInProject.find({ project: project[0]._id })
                let user_exist_in_proj = false
                for (let o = 0; o < users_in_project.length; o++)
                    if (users_in_project[o]?.user?._id.toString() == req.user.id)
                        user_exist_in_proj = true
                if (user_exist_in_proj) {
                    if (req.body.title && req.body.description && req.body.state && req.body.priority && req.body.type) {
                        const newTask = new Task({
                            project: project[0]._id,
                            title: req.body.title,
                            description: req.body.description,
                            state: req.body.state,
                            priority: req.body.priority,
                            type: req.body.type,
                            images: req?.body?.images
                        })
                        await newTask.save()
                        const tasks = await Task.find({ project: project[0]._id })
                        return res.json({ success: true, msg: "Task added.", tasks })
                    }
                    return res.json({ success: false, msg: "Some field is empty." })
                }
                return res.json({ success: false, msg: "User not in project." })
            }
            return res.json({ success: false, msg: "Project does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getTasks: async (req, res) => {
        try {
            let project = await Project.find({ uniqueLink: req.params.projectLink })
            console.log(req.query)
            if (project.length) {
                let search_obj = {}
                search_obj.project = project[0]._id
                if (req.query.type != 'blank')
                    search_obj.type = req.query.type
                if (req.query.state != 'blank')
                    search_obj.state = req.query.state
                if (req.query.priority != 'blank')
                    search_obj.priority = req.query.priority
                if (req.query.search) {
                    search_obj.$or = [{ title: { "$regex": req.query.search, "$options": "i" } }, { description: { "$regex": req.query.search, "$options": "i" } }]
                }
                if(parseInt(req.query.whichShow) == 1) {
                    search_obj.user = mongoose.Types.ObjectId(req.user.id)
                }
                if(parseInt(req.query.whichShow) == 2) {
                    search_obj.user = null
                }

                let tasks_in_project = await Task.find(search_obj)
                console.log(tasks_in_project)
                return res.json({ success: true, tasks_in_project })

            }
            return res.json({ success: false, msg: "Project does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getTask: async (req, res) => {
        try {
            let task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) }).populate('user')
            if (task.length) {
                return res.json({ success: true, task: task[0] })
            }
            return res.json({ success: false, msg: "Task does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    putWorkerTask: async (req, res) => {
        try {
            let task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) })
            if (task.length) {
                if (req.body.setworker)
                    task[0].user = mongoose.Types.ObjectId(req.user.id)
                else
                    task[0].user = null
                await task[0].save()
                task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) }).populate('user')
                return res.json({ success: true, task: task[0] })
            }
            return res.json({ success: false, msg: "Task does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    deleteTask: async (req, res) => {
        try {
            let task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) })
            if (task.length) {
                await task[0].remove()

                return res.json({ success: true, msg: "Task removed." })
            }
            return res.json({ success: false, msg: "Task does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    updateTask: async(req, res) => {
        try {
            let task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) })
            if (task.length) {
                task[0].title = req.body.title
                task[0].description = req.body.description
                task[0].state = req.body.state
                task[0].priority = req.body.priority
                task[0].type = req.body.type
                task[0].images = req.body.images
                await task[0].save()

                return res.json({ success: true, msg: "Task udated." })
            }
            return res.json({ success: false, msg: "Task does not exist." })
        } catch (err) {
            console.log(1)
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}



module.exports = taskCtrl
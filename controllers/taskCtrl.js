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
    uploadImage: async(req,res) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({ success: false, msg: "No files were uploaded." })

            const file = req.files.file;

            if (file.size > 5 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ success: false, msg: "Image weighs more than 5mb." })
            }
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ success: false, msg: "File format not a png/jpg/jpeg." })
            }

            let new_image_name = `uploads/tasks/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err,) => {

                if (err) {
                    return res.status(500).json({success: false, msg: err })
                }
                return res.json({success: true, url: new_image_name })
            });
        } catch (err) {
            return res.status(500).json({ success: false, msg: err.message })
        }
    },
    createTask: async(req,res) => {
        try {
            let project = await Project.find({uniqueLink: req.params.projectLink}) 
            if (project.length) {
                let users_in_project = await UsersInProject.find({project: project[0]._id })
                let user_exist_in_proj = false
                for (let o = 0; o < users_in_project.length; o++) 
                    if(users_in_project[o]?.user?._id.toString() == req.user.id)
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
                        const tasks = await Task.find({project: project[0]._id})
                        console.log(tasks)
                        return res.json({success: true, tasks})
                    }
                    return res.json({success: false, msg: "Some field is empty."})
                }
                return res.json({success: false, msg: "User not in project."})
            }
            return res.json({success: false, msg: "Project does not exist."})
        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, msg: err })
        }
    }
}



module.exports = taskCtrl
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
            let users_in_project = await UsersInProject.find({project: project[0]._id })
            console.log(project, users_in_project, req.body)
            // if (!req.files || Object.keys(req.files).length === 0)
            //     return res.status(400).json({ success: false, msg: "No files were uploaded." })

            // const file = req.files.file;

            // if (file.size > 5 * 1024 * 1024) {
            //     removeTmp(file.tempFilePath)
            //     return res.status(400).json({ success: false, msg: "Image weighs more than 5mb." })
            // }
            // if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
            //     removeTmp(file.tempFilePath)
            //     return res.status(400).json({ success: false, msg: "File format not a png/jpg/jpeg." })
            // }

            // let new_image_name = `uploads/tasks/${Date.now()}_${file.name}`
            // fs.rename(file.tempFilePath, new_image_name, (err,) => {

            //     if (err) {
            //         return res.status(500).json({success: false, msg: err })
            //     }
            //     return res.json({success: true, url: new_image_name })
            // });
        } catch (err) {
            return res.status(500).json({ success: false, msg: err.message })
        }
    }
}



module.exports = taskCtrl
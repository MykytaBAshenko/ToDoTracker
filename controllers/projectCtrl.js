const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const fs = require('fs');




const projectCtrl = {
    uploadLogo: async (req,res) => {
        try {
            console.log(req.user)
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({ msg: "No files were uploaded." })
            const file = req.files.file;

            if (file.size > 30 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "Size too large." })
            } //30mb

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.status(400).json({ msg: "File format is incorrect." })
            }
            let new_image_name = `uploads/projects/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err,) => {

                if (err) {
                    return res.status(500).json({ msg: err })
                }
                return res.json({ url: new_image_name })
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProject: async (req,res) => {
        try {
            if (req.body.name && req.body.description && req.body.logo) {
                const project = await Project.find({ uniqueLink: req.body.uniqueLink })
                if(!project.length) {
                    const newProject = new Project({
                        name: req.body.name,
                        description: req.body.description,
                        logo: req.body.logo,
                        uniqueLink: req.body.uniqueLink,
                        arrayOfLinks: req.body.arrayOfLinks,
                    })
                    const createdProject = await newProject.save()
                    const user = await Users.find({ "_id": req.user.id })
                    const UserInProj = new UsersInProject({
                        user: mongoose.Types.ObjectId(req.user.id),
                        project: mongoose.Types.ObjectId(createdProject._id),
                        status: "Owner",
                        nickname: user[0].nickname,
                        whatDo: "Project owner",
                        about: ""
                    })
                    const userInProject = await UserInProj.save()
                    return res.json({success:true, msg: "The project was created", userInProject, createdProject})
                }
                return res.json({success: false, msg: "Project with same link exist"})
            }
            return res.json({success: false, msg: "Something is not set"})


        } catch (err) {
            console.log(err)
            res.json({success: false, msg: err})
        }
    }
}



module.exports = projectCtrl
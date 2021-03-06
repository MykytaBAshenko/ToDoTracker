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
    },
    getProjects: async (req,res) => {
        try {
            let rolesInProjects = await UsersInProject.find({"user": mongoose.Types.ObjectId(req.user.id)}).populate("project")
            res.json({success:true, projects: rolesInProjects})
        } catch (err) {
            res.json({success: false, msg: err})
        }
    },
    addUser: async (req,res) => {
        try {
            let project = await Project.find({uniqueLink: req.params.projectLink})
            // console.log(project, req.user, req.body)
            let users_in_project = await UsersInProject.find({project: project[0]._id })
            // console.log(users_in_project)
            let user_exist = false;
            for(let o  = 0; o < users_in_project.length; o++) {
                if (users_in_project[o].user.toString() == req.user.id)
                    user_exist = true
            }
            let invate_user = await Users.find({ email:req.body.adduser})
            console.log(invate_user)
            // console.log(user_exist)
            // let rolesInProjects = await UsersInProject.find({"user": mongoose.Types.ObjectId(req.user.id)}).populate("project")
            // res.json({success:true, projects: rolesInProjects})
        } catch (err) {
            res.json({success: false, msg: err})
        }
    },
    getProject: async (req,res) => {
        try {
            // console.log(req.user,req.params.projectLink)
            const project = await Project.find({ "uniqueLink": req.params.projectLink })
            console.log(project)
            if(project.length) {
                const UsersIn = await UsersInProject
                    .find({project: project[0]._id})
                    .populate("user")
                    .select('-password')
                return res.json({success: true,msg:"Project exist", UsersInProject: UsersIn, Project: project[0]})
            } 
            else {
                return res.json({success: false, msg: "Project does not exist"})
            }
            // if (req.body.name && req.body.description && req.body.logo) {
            //     const project = await Project.find({ uniqueLink: req.body.uniqueLink })
            //     if(!project.length) {
            //         const newProject = new Project({
            //             name: req.body.name,
            //             description: req.body.description,
            //             logo: req.body.logo,
            //             uniqueLink: req.body.uniqueLink,
            //             arrayOfLinks: req.body.arrayOfLinks,
            //         })
            //         const createdProject = await newProject.save()
            //         const user = await Users.find({ "_id": req.user.id })
            //         const UserInProj = new UsersInProject({
            //             user: mongoose.Types.ObjectId(req.user.id),
            //             project: mongoose.Types.ObjectId(createdProject._id),
            //             status: "Owner",
            //             nickname: user[0].nickname,
            //             whatDo: "Project owner",
            //             about: ""
            //         })
            //         const userInProject = await UserInProj.save()
            //         return res.json({success:true, msg: "The project was created", userInProject, createdProject})
            //     }
            //     return res.json({success: false, msg: "Project with same link exist"})
            // }
            // return res.json({success: false, msg: "Something is not set"})


        } catch (err) {
            console.log(err)
            res.json({success: false, msg: err})
        }
    }
}



module.exports = projectCtrl
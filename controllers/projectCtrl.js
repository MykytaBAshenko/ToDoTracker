const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')
const Messages = require('../models/messageModel')
const Task = require('../models/taskModel')

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
            if (req.body.name && req.body.logo) {
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
            if(project.length) {
                let users_in_project = await UsersInProject.find({project: project[0]._id })
                let user_exist = false
                for(let o  = 0; o < users_in_project.length; o++) {
                    if (users_in_project[o].user.toString() == req.user.id)
                        user_exist = true
                }
                if(user_exist) {
                    let invate_user = await Users.find({ email:req.body.adduser})
                    if(invate_user.length) {
                        let user_exist_in_proj = false
                        for (let y = 0; y < users_in_project.length; y++)
                            if(invate_user[0]._id.toString() == users_in_project[y].user.toString())
                                user_exist_in_proj = true
                        if(!user_exist_in_proj) {
                            const UserInProj = new UsersInProject({
                                user: invate_user[0]._id,
                                project: mongoose.Types.ObjectId(project[0]._id),
                                status: "Member",
                                nickname: invate_user[0].nickname,
                                whatDo: "User",
                                about: ""
                            })
                            await UserInProj.save()
                            const UsersInProj = await UsersInProject.find({project:mongoose.Types.ObjectId(project[0]._id)}).populate("user")
                            return res.json({success:true,msg: "User added to the project", UsersInProject: UsersInProj })
                        }
                        return res.json({success:false, msg: "User with such mail already exists in the project."  })
                    }
                    return res.json({success:false, msg: "User with such mail does not exist."  })
                }
                return res.json({success:false, msg: "Project does not exist."  })
            } else {
                return res.json({success:false, msg: "Current user not in project."  })
            }

        } catch (err) {
            console.log(err)
            res.json({success: false, msg: err})
        }
    },
    getProject: async (req,res) => {
        try {
            const project = await Project.find({ "uniqueLink": req.params.projectLink })
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
        } catch (err) {
            console.log(err)
            res.json({success: false, msg: err})
        }
    },
    getUsers: async (req,res) => {
        try {
            const project = await Project.find({ "uniqueLink": req.params.projectLink })
            if(project.length) {
                const UsersIn = await UsersInProject
                    .find({project: project[0]._id})
                    .populate("user")
                    .select('-password')
                return res.json({success: true, UsersInProject: UsersIn})
            } 
            else {
                return res.json({success: false, msg: "Project does not exist"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    deleteUser: async (req, res) => {
        try {
            const project = await Project.find({ "uniqueLink": req.params.projectLink })
            if(project.length) {
                const UsersIn = await UsersInProject
                    .find({project: project[0]._id})
                    .populate("user")
                for(let o = 0; o < UsersIn.length; o++){
                    if(UsersIn[o]._id.toString() == req.params.userId.toString() ) {
                        UsersIn[o].remove()
                        UsersIn.splice(o, 1)
                        return res.json({success: true, msg: "User has been deleted!", UsersInProject: UsersIn})
                    }
                }
                return res.json({success: false, msg: "Something went wrong!"})
                
            } 
            else {
                return res.json({success: false, msg: "Project does not exist"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    getUserInfo: async (req, res) => {
        try {
            const project = await Project.find({ "_id": req.params.projectId })
            if(project.length && req.params.userId) {

               const UsersIn = await UsersInProject
                    .find({ $and: [ { project: mongoose.Types.ObjectId(project[0]._id) }, { user: mongoose.Types.ObjectId(req.params.userId) } ] })
                    .populate("user")
                if(UsersIn.length)
                    return res.json({success: true, UsersIn}) 
                return res.json({success: false, msg: "Something went wrong!"})
            } 
            else {
                return res.json({success: false, msg: "Project does not exist"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    deleteProject: async (req, res) => {
        try {
            const project = await Project.find({ "_id": req.params.projectId })
            if(project.length){
                await UsersInProject.find({project: mongoose.Types.ObjectId(req.params.projectId)}).remove()
                await Messages.find({project: mongoose.Types.ObjectId(req.params.projectId)}).remove()
                await Task.find({project: mongoose.Types.ObjectId(req.params.projectId)}).remove()
                project[0].remove()
                return res.json({success: true, msg: "Project has been deleted"})
            } 
            return res.json({success: false, msg: "Project does not exist"})
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }    
    },
    upadteProject: async (req, res) => {
        try {
            const project = await Project.find({ "_id": req.params.projectId })
            const projectwithlink = await Project.find({ "uniqueLink": req.body.uniqueLink })
            if (projectwithlink[0]._id.toString() != project[0]._id.toString())
                return res.json({success: false, msg: "Project with same link exist"})
            if(project.length){
                project[0].name = req.body.name
                project[0].description = req.body.description
                project[0].logo = req.body.logo
                project[0].uniqueLink = req.body.uniqueLink
                project[0].arrayOfLinks = req.body.arrayOfLinks
                await project[0].save()
                return res.json({success: true, msg: "Project has been updated!"})
            } 
            return res.json({success: false, msg: "Project does not exist!"})
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    patchUserInProject: async (req, res) => {
        try {
            const project = await Project.find({ "_id": req.params.projectId })
            let user = await UsersInProject.find({"_id": req.params.userIdInPr })
            if (user.length) {
                user[0].about = req.body.UserAbout
                user[0].whatDo = req.body.UserWhatDo
                await user[0].save()

                return res.json({success: true, msg: "User has been updated!"})
            }
            return res.json({success: false, msg: "Error with user!"})

                // const projectwithlink = await Project.find({ "uniqueLink": req.body.uniqueLink })
            // if (projectwithlink[0]._id.toString() != project[0]._id.toString())
            //     return res.json({success: false, msg: "Project with same link exist"})
            // if(project.length){
            //     project[0].name = req.body.name
            //     project[0].description = req.body.description
            //     project[0].logo = req.body.logo
            //     project[0].uniqueLink = req.body.uniqueLink
            //     project[0].arrayOfLinks = req.body.arrayOfLinks
            //     await project[0].save()
            //     return res.json({success: true, msg: "Project has been updated!"})
            // } 
            // return res.json({success: false, msg: "Project does not exist!"})
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }    
    }
}



module.exports = projectCtrl
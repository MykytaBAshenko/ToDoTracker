const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const Comment = require('../models/commentModel')
const Task = require('../models/taskModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const fs = require('fs');




const commentsCtrl = {
    getComments: async(req,res) => {
        try {
            let comments = await Comment.find({task: mongoose.Types.ObjectId(req.params.taskId)}).populate('user')

            res.json({success:true, comments})
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    createComment: async(req, res) => {
        try {
            console.log(req.params.taskId, req.body, req.user)
            let task = await Task.find({ _id: mongoose.Types.ObjectId(req.params.taskId) })
            if(task.length) {
                const task = new Comment({
                    user: mongoose.Types.ObjectId(req.user.id),
                    task: mongoose.Types.ObjectId(req.params.taskId),
                    description: req.body.changeinput
                })
                await task.save()
                let comments = await Comment.find({task: mongoose.Types.ObjectId(req.params.taskId)}).populate('user')
                return res.json({success:true, comments})
            }
            return res.json({success:false, msg: "Task does not exist."})
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }  
    },
    dropComment: async(req,res) => {
        try {
            let comment = await Comment.find({ _id: mongoose.Types.ObjectId(req.params.commentId) })
            if(comment[0].user.toString() == req.user.id) {
                await comment[0].remove()
                let comments = await Comment.find({task: mongoose.Types.ObjectId(req.params.taskId)}).populate('user')
                return res.json({success:true, comments})
            }
            else{
                return res.json({success:false, msg: "Not your comment!"})

            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }  
    }, 
    upadteComment: async(req, res) => {
        try {
            let comment = await Comment.find({ _id: mongoose.Types.ObjectId(req.params.commentId) })
            if(comment[0].user.toString() == req.user.id) {
                comment[0].description = req.body.changeinput
                await comment[0].save()
                let comments = await Comment.find({task: mongoose.Types.ObjectId(req.params.taskId)}).populate('user')
                return res.json({success:true, comments})
            }
            else{
                return res.json({success:false, msg: "Not your comment!"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    }
}



module.exports = commentsCtrl
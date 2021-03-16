const Project = require('../models/projectModel')
const Users = require('../models/userModel')
const Messages = require('../models/messageModel')
const UsersInProject = require('../models/userInProjectModel')
const mongoose = require('mongoose')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const fs = require('fs');




const msgCtrl = {
   get100msg: async (req, res) => {
    try {
        let project = await Project.find({uniqueLink: req.params.projectLink})
        if(project.length){
            let msgs = await Messages.find({project: mongoose.Types.ObjectId(project[0]._id)}).sort({createdAt: -1}).limit(100).populate("user")
            // console.log(msgs)
            return res.json({ success: true, msgs })

        }
        return res.json({ success: false })

    } catch (err) {
        return res.json({ success: false })
    }
   }
}



module.exports = msgCtrl
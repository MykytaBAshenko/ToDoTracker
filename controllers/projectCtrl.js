const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')




const projectCtrl = {
    createProject: async (req,res) => {
        console.log(req,res)
    }
}



module.exports = projectCtrl
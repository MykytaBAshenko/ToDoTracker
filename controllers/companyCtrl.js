const Company = require('../models/companyModel')
const Users = require('../models/userModel')
const UserInCompany = require('../models/userInCompanyModel')
const mongoose = require('mongoose')
const Messages = require('../models/messageModel')
const Task = require('../models/taskModel')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const fs = require('fs');
const { search } = require('../routes/authRouter')


const companyCtrl = {
  uploadLogo: async (req,res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.json({success: false, msg: "No files were uploaded." })
        const file = req.files.file;

        if (file.size > 30 * 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.json({success: false, msg: "Size too large." })
        } //30mb

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
            removeTmp(file.tempFilePath)
            return res.json({success: false, msg: "File format is incorrect." })
        }
        console.log(req.user)

        let new_image_name = `uploads/companies/${Date.now()}_${file.name}`
        fs.rename(file.tempFilePath, new_image_name, (err,) => {

            if (err) {
                return res.json({ msg: err })
            }
            return res.json({success: true, url: new_image_name })
        });
    } catch (err) {
        console.log(err)
        return res.json({success: false, msg:"Something broke!"})
    }
  },
  createCompany: async (req,res) => {
    try {
      console.log(req.body)
      if (req.body.name && req.body.logo) {
            const company = await Company.find({ uniqueLink: req.body.uniqueLink })
            if(!company.length) {
                const newCompany = new Company({
                    name: req.body.name,
                    description: req.body.description,
                    logo: req.body.logo,
                    uniqueLink: req.body.uniqueLink,
                })
                const createdCompany = await newCompany.save()
                const UserInComp = new UserInCompany({
                    user: mongoose.Types.ObjectId(req.user.id),
                    company: mongoose.Types.ObjectId(createdCompany._id),
                    status: "Owner"
                })
                const userInCompany = await UserInComp.save()
                return res.json({success:true, msg: "The company was created", userInCompany, createdCompany})
            }
            return res.json({success: false, msg: "Company with same link exist"})
        }
        return res.json({success: false, msg: "Something is not set"})


    } catch (err) {
        console.log(err)
        res.json({success: false, msg:"Something broke!"})
    }
  },
  getCompanys: async(req, res) => {
    try {
      let companys = await UserInCompany.find({"user": mongoose.Types.ObjectId(req.user.id)}).populate("company")
      res.json({success:true, companys})
    } catch (err) {
        res.json({success: false, msg:"Something broke!"})
    }
  },
  getCompany: async(req, res) => {
    try {
        const company = await Company.find({ "uniqueLink": req.params.companyLink })
        if(company.length) {
            const UsersIn = await UserInCompany
                .find({$and: [{company: company[0]._id, user: req.user.id }]})
                .populate("user")
                .select('-password')
            return res.json({success: true,msg:"Company exist", UserInCompany: UsersIn, Company: company[0]})
            
        } 
        else {
            return res.json({success: false, msg: "Project does not exist"})
        }
    } catch (err) {
        console.log(err)
        res.json({success: false, msg:"Something broke!"})
    }
  },
  addUser: async (req,res) => {
        try {
            let company = await Company.find({uniqueLink: req.params.companyLink})
            console.log(req.body)
            if(company.length) {
                let users_in_company = await UserInCompany.find({company: company[0]._id })
                let user_exist = false
                for(let o  = 0; o < users_in_company.length; o++) {
                    if (users_in_company[o].user.toString() == req.user.id)
                        user_exist = true
                }
                if(user_exist) {
                    let invate_user = await Users.find({ email:req.body.adduser})
                    if(invate_user.length) {
                        let user_exist_in_proj = false
                        for (let y = 0; y < users_in_company.length; y++)
                            if(invate_user[0]._id.toString() == users_in_company[y].user.toString())
                                user_exist_in_proj = true
                        if(!user_exist_in_proj) {
                            const UserInProj = new UserInCompany({
                                user: invate_user[0]._id,
                                company: mongoose.Types.ObjectId(company[0]._id),
                                status: "Member",
                            })
                            await UserInProj.save()
                            const UsersInProj = await UserInCompany.find({company:mongoose.Types.ObjectId(company[0]._id)}).populate("user")
                            return res.json({success:true,msg: "User added to the company", UsersInProject: UsersInProj })
                        }
                        return res.json({success:false, msg: "User with such mail already exists in the company."  })
                    }
                    return res.json({success:false, msg: "User with such mail does not exist."  })
                }
                return res.json({success:false, msg: "Company does not exist."  })
            } else {
                return res.json({success:false, msg: "Current user not in company."  })
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    getUsers: async (req,res) => {
        try {
            console.log(req.params)
            const company = await Company.find({ "uniqueLink": req.params.companyLink })
            if(company.length) {
                const UsersIn = await UserInCompany
                    .find({company: company[0]._id})
                    .populate("user")
                    .select('-password')
                return res.json({success: true, UsersInCompany: UsersIn})
            } 
            else {
                return res.json({success: false, msg: "Comapny does not exist"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
    deleteUser: async (req, res) => {
        try {
            const company = await Company.find({"uniqueLink": req.params.companyLink })
            if(company.length) {
                const UsersIn = await UserInCompany
                    .find({company: company[0]._id})
                    .populate("user")
                for(let o = 0; o < UsersIn.length; o++){
                    if(UsersIn[o]._id.toString() == req.params.userId.toString() ) {
                        UsersIn[o].remove()
                        UsersIn.splice(o, 1)
                        return res.json({success: true, msg: "User deleted!", UsersInProject: UsersIn})
                    }
                }
                return res.json({success: false, msg: "Something went wrong!"})
                
            } 
            else {
                return res.json({success: false, msg: "Company does not exist"})
            }
        } catch (err) {
            console.log(err)
            res.json({success: false, msg:"Something broke!"})
        }
    },
}


module.exports = companyCtrl    
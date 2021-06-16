const Users = require('../models/userModel')
const Company = require('../models/companyModel')
const UserInCompany = require('../models/userInCompanyModel')
const Event = require('../models/eventModel')

const mongoose = require('mongoose')

const fs = require('fs');





const eventCtrl = {
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
    createEvent: async(req, res) => {
        try {
            let company = await Company.find({ uniqueLink: req.params.companyLink })
            if (company.length) {
                let users_in_company = await UserInCompany.find({ company: company[0]._id })
                let user_exist_in_company = false
                for (let o = 0; o < users_in_company.length; o++)
                    if (users_in_company[o]?.user?._id.toString() == req.user.id)
                        user_exist_in_company = true
                if (user_exist_in_company) {
                    if (req.body.title && req.body.description && req.body.type && req.body.latitude && req.body.longitude) {
                        const newEvent = new Event({
                            company: company[0]._id,
                            title: req.body.title,
                            description: req.body.description,
                            type: req.body.type,
                            images: req?.body?.images,
                            date: req?.body?.date,
                            cost: req?.body?.cost,
                            latitude: req?.body?.latitude,
                            longitude: req?.body?.longitude
                        })
                        await newEvent.save()
                        return res.json({ success: true, msg: "Event sent for review."})
                    }
                    return res.json({ success: false, msg: "Some field is empty." })
                }
                return res.json({ success: false, msg: "User not in company." })
            }
            return res.json({ success: false, msg: "Company does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getNonApproved: async(req, res) => {
        try {
            let user = await Users.find({_id: req.user.id})
            if(!user.length)
                res.json({success: false, msg: "User is not admin"})
            let NonApproved = await Event.find({approved:false}).populate("company")
            res.json({success: true, NonApproved})
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    }
}



module.exports = eventCtrl
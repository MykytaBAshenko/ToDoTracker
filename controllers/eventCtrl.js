const Users = require('../models/userModel')
const Company = require('../models/companyModel')
const UserInCompany = require('../models/userInCompanyModel')

const mongoose = require('mongoose')

const fs = require('fs');





const taskCtrl = {
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
    }
}



module.exports = taskCtrl
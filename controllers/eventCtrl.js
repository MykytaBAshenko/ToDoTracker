const Users = require('../models/userModel')
const Company = require('../models/companyModel')
const UserInCompany = require('../models/userInCompanyModel')
const Event = require('../models/eventModel')
const Ticket = require('../models/ticketModel')

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
                    if(!req.body.images[0])
                        req.body.images[0]="/images/defaultEvent.jpg"
                    if (req.body.title && req.body.description && req.body.type) {
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
    },
    approveEvent: async(req, res) => {
        try {
            let user = await Users.find({_id: req.user.id})
            if(!user.length)
                res.json({success: false, msg: "User is not admin"})
            console.log(req.body)
            let ChangeEvent = await Event.find({_id:req.body.id})
                if(ChangeEvent.length) {
                    ChangeEvent[0].approved = true
                    await ChangeEvent[0].save()
                    let NonApproved = await Event.find({approved:false}).populate("company")
                    res.json({success: true, NonApproved, msg: "Event admitted successfully."})
                }
                else {
                    res.json({success: false, msg: "Something broke."})
                }
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    dropEvent: async(req, res) => {
        try {
            let user = await Users.find({_id: req.user.id})
            if(!user.length)
                res.json({success: false, msg: "User is not admin"})
            console.log(req.body)
            let ChangeEvent = await Event.find({_id:req.body.id})
                if(ChangeEvent.length) {
                    ChangeEvent[0].approved = true
                    await ChangeEvent[0].remove()
                    let NonApproved = await Event.find({approved:false}).populate("company")
                    res.json({success: true, NonApproved, msg: "Event removed successfully."})
                }
                else {
                    res.json({success: false, msg: "Something broke."})
                }
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getEvent: async(req, res) => {
        try {
            let event = await Event.find({ _id: mongoose.Types.ObjectId(req.params.eventid) }).populate('user')
            let ticket = await Ticket.find( { $and: [ { user: req.user.id }, { event: event[0]._id  } ] } )
            if (event.length) {
                console.log(ticket)
                return res.json({ success: true, event: event[0], ticket: ticket[0] })
            }
            return res.json({ success: false, msg: "Event does not exist." })

        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getEvents: async(req, res) => {
        try {
            console.log(req.query)
                let search_obj = {}
                search_obj.approved = true
                if (req.query.type)
                    search_obj.type = req.query.type
                if(req.query.fromdate||req.query.tilldate) {
                    search_obj.date = {}
                }
                if(req.query.fromdate) {
                    search_obj.date.$gte = req.query.fromdate
                }            
                if(req.query.tilldate) {
                    search_obj.date.$lt = req.query.tilldate
                }            
                if (req.query.search) {
                    search_obj.$or = [{ title: { "$regex": req.query.search, "$options": "i" } }, { description: { "$regex": req.query.search, "$options": "i" } }]
                }
                if (req.query.mincost || req.query.maxcost) {
                    search_obj.cost = {}
                    if(req.query.mincost) {
                        search_obj.cost.$gte = req.query.mincost
                    }
                    if(req.query.maxcost) {
                        search_obj.cost.$lt = req.query.maxcost
                    }
                }


                let events = await Event.find(search_obj).populate("company")
                return res.json({ success: true, events })

        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    buyEvent: async(req, res) => {
        try {
            let event = await Event.find({ _id: mongoose.Types.ObjectId(req.params.eventid) }).populate('user')
            console.log(event)
            if(event.length && req.body.paymentToken) {
                const newTicket = new Ticket({
                    event: event[0]._id,    
                    user: mongoose.Types.ObjectId(req.user.id),
                    paymentToken: req.body.paymentToken,
                    paymentID: req.body.paymentID
                })
                await newTicket.save()
                return res.json({ success: true, msg: "Event was successfully purchased." })
            }
            return res.json({ success: false, msg: "Event does not exist." })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        }
    },
    getTickets: async(req, res) => {
        try {
            let tickets = await Ticket.find({
                user: mongoose.Types.ObjectId(req.user.id)
            }).populate("event")
            return res.json({ success: true, tickets })
        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        } 
    },
    getCompanyEarnings: async(req, res) => {
        try {
            let events = await Event.find({ company: mongoose.Types.ObjectId(req.params.comapanyId) }).populate('user')
            let sendArr = []
            for(let u = 0; u < events.length; u++) {
                let transactions = await Ticket.find({event: events[u]._id}).populate('user').populate('event')
                sendArr.push(transactions)
            }
            return res.json({ success: true, sendArr })

        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        } 
    },
    getCompanyEvents: async(req, res) => {
        try {

            let company = await Company.find({ uniqueLink: req.params.uniqueLink })
            
            if(company.length) {
                let events = await Event.find({ company: company[0]._id,approved: true })
            return res.json({ success: true, events })

            }            
            // let events = await Event.find({ company: mongoose.Types.ObjectId(req.params.comapanyId) }).populate('user')
            // let sendArr = []
            // for(let u = 0; u < events.length; u++) {
            //     let transactions = await Ticket.find({event: events[u]._id}).populate('user').populate('event')
            //     sendArr.push(transactions)
            // }
            // return res.json({ success: true, sendArr })
            return res.json({ success: false, msg: "Something broke." })

        } catch (err) {
            console.log(err)
            return res.json({ success: false, msg: "Something broke." })
        } 
    },
    getAdminTransactions: async(req, res) => {
        let tickets = await Ticket.find().populate({
            path : 'event',
            populate : {
              path : 'company'
            }
          }).populate("user")
        return res.json({success: true, tickets})
    }
}



module.exports = eventCtrl
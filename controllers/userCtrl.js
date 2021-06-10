const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendEmail} = require('./sendMail')

const { google } = require('googleapis')
const { OAuth2 } = google.auth
const fetch = require('node-fetch')
const fs = require('fs');

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const { CLIENT_URL } = process.env

const userCtrl = {
    register: async (req, res) => {
        try {
            const { avatar, email, password, nickname } = req.body

            if (!avatar || !email || !password || !nickname)
                return res.json({success: false, msg: "Please fill in all fields." })

            if (!validateEmail(email))
                return res.json({success: false, msg: "Invalid emails." })

            const user = await Users.findOne({ email })
            if (user) return res.json({success: false, msg: "This email already exists." })

            if (password.length < 8)
                return res.json({success: false, msg: "Password must be at least 8 characters." })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = {
                avatar, nickname, email, password: passwordHash
            }
            const activation_token = createActivationToken(newUser)
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            await sendEmail(email, url, "Verify your email address")
            
            res.json({success: true, msg: "Submit your email!"})

        } catch (err) {
            console.log(err)
            return res.json({ success:false, msg: "Something broke!" })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
            const { avatar, email, password, nickname } = user
            
            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ msg: "This email already exists." })

            const newUser = new Users({
                avatar, email, password, nickname
            })

            let u = newUser.save()
            res.json({ success:true})
        } catch (err) {
            console.log(err)
            return res.json({success:false, msg: "Something broke!" })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
            if (!user) return res.json({success:false, msg: "This email does not exist." })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.json({success:false, msg: "Password is incorrect." })

            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/auth/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({success:true, msg: "Login success!" })
        } catch (err) {
            return res.json({ success:false, msg: "Something broke!" })
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.json({ msg: "Please login now!" })
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.json({ msg: "Please login now!" })

                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })
        } catch (err) {
            return res.json({ success:false, msg: "Something broke!" })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.json({success: false, msg: "This email does not exist." })

            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendEmail(email, url, "Reset your password")
            res.json({success: true, msg: "Check your email." })
        } catch (err) {
            return res.json({success: false, msg: "Something broke!" })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            const passwordHash = await bcrypt.hash(password, 12)

            let user = await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            if(user)
                return res.json({success: true, msg: "Password successfully changed!" })
            return res.json({success: false,  msg: "Something broke!" })
        } catch (err) {
            return res.json({success: false,  msg: "Something broke!" })
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')

            res.json(user)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {

            const users = await Users.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/auth/refresh_token' })
            return res.json({ msg: "Logged out." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, avatar } = req.body
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                name, avatar
            })
            res.json({ msg: "Update Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const { role } = req.body
            await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })
            res.json({ msg: "Update Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({ msg: "Deleted Success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body
            const verify = await client.verifyIdToken({ idToken: tokenId})
            const { email_verified, email, picture, name } = verify.payload
            const password = email+Math.random()
            const passwordHash = await bcrypt.hash(password, 12)
            if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

            const user = await Users.findOne({ email })
            if (user) {
                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/api/auth/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    email, password: passwordHash, avatar: picture, nickname: name
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/api/auth/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.json({ msg: "Login success!" })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).json({success:false, msg: err.message })
        }
    },
    uploadImage: async function (req, res, next) {
        try {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.json({success: false, msg: "No files were uploaded." })

            const file = req.files.file;

            if (file.size > 8 * 1024 * 1024) {
                removeTmp(file.tempFilePath)
                return res.json({ msg: "Size too large." })
            }
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
                removeTmp(file.tempFilePath)
                return res.json({success: false, msg: "File format is incorrect." })
            }

            let new_image_name = `uploads/users/${Date.now()}_${file.name}`
            fs.rename(file.tempFilePath, new_image_name, (err) => {

                if (err) {
                    return res.json({success: false, msg: "Something broke." })
                }
                return res.json({success: true, url: new_image_name })
            });
        } catch (err) {
            console.log(err)
            return res.json({success: false, msg: "Something broke." })
        }
    },
    changeUser: async (req, res) => {
        try {
            console.log(req)
            const { nickname, avatar } = req.body

            let user = await Users.findOneAndUpdate({ _id: req.user.id }, {
                avatar, nickname
            })
            if(user)
                return res.json({success: true, msg: "Information has been changed!" })
            return res.json({success: false,  msg: "Something broke!" })
        } catch (err) {
            console.log(err)
            return res.status(500).json({success: false, msg: "Something broke!" })
        }
    },
    checkAdmin: async(req, res) => {
        try {
            console.log(req.body)
            const {admincode} = req.body
            console.log(admincode, req.user)
            if (!req.body.is_become_admin) {
                let user = await Users.findOneAndUpdate({ _id: req.user.id }, {
                    isAdmin: false
                })
                if (user) 
                    return res.json({success: true, msg: "You stopped being an admin!"})
                
            }
            if (process.env.SECRET_ADMIN_CODE === admincode){
                let user = await Users.findOneAndUpdate({ _id: req.user.id }, {
                    isAdmin: true
                })
                if (user) 
                    return res.json({success: true, msg: "You admin now!"})
            }
            else {
                return res.json({success: false,  msg: "Wrong code!" })
            }
        }
        catch (err) {
            consolr.log(err)
            return res.json({success: false, msg: "Something went wrong!"})
        }
    }
    // facebookLogin: async (req, res) => {
    //     try {
    //         const { accessToken, userID } = req.body

    //         const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

    //         const data = await fetch(URL).then(res => res.json()).then(res => { return res })

    //         const { email, name, picture } = data
    //         console.log(data)
    //         const password = email + process.env.FACEBOOK_SECRET

    //         const passwordHash = await bcrypt.hash(password, 12)

    //         const user = await Users.findOne({ email })
    //         console.log(user)
    //         if (user) {
    //             // const isMatch = await bcrypt.compare(password, user.password)
    //             // if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

    //             const refresh_token = createRefreshToken({ id: user._id })
    //             res.cookie('refreshtoken', refresh_token, {
    //                 httpOnly: true,
    //                 path: '/api/auth/refresh_token',
    //                 maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    //             })

    //             res.json({ msg: "Login success!" })
    //         } else {
    //             const newUser = new Users({
    //                 name, email, password: passwordHash, avatar: picture.data.url, fullname: name
    //             })

    //             await newUser.save()

    //             const refresh_token = createRefreshToken({ id: newUser._id })
    //             res.cookie('refreshtoken', refresh_token, {
    //                 httpOnly: true,
    //                 path: '/api/auth/refresh_token',
    //                 maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    //             })

    //             res.json({ msg: "Login success!" })
    //         }


    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message })
    //     }
    // }
}





function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl
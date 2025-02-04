const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/register', userCtrl.register)

router.post('/activation', userCtrl.activateEmail)

router.post('/login', userCtrl.login)

router.post('/refresh_token', userCtrl.getAccessToken)

router.post('/forgot', userCtrl.forgotPassword)

router.post('/reset', auth, userCtrl.resetPassword)

router.get('/infor', auth, userCtrl.getUserInfor)

router.get('/logout', userCtrl.logout)

router.post('/googlelogin', userCtrl.googleLogin)

router.post('/uploadimage', userCtrl.uploadImage)

router.patch('/changeinfo',auth, userCtrl.changeUser)

router.post('/checkadmincode',auth, userCtrl.checkAdmin)

module.exports = router
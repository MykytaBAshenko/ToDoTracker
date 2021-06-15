const router = require('express').Router()
const eventCtrl = require('../controllers/eventCtrl')
const auth = require('../middleware/auth')


router.post('/uploadphoto',auth, eventCtrl.uploadImage)




 
module.exports = router
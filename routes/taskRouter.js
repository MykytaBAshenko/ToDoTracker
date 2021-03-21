const router = require('express').Router()
const taskCtrl = require('../controllers/taskCtrl')
const auth = require('../middleware/auth')


router.post('/uploadphoto',auth, taskCtrl.uploadImage)
router.post('/create/:projectLink',auth, taskCtrl.createTask)
router.get('/:projectLink',auth, taskCtrl.getTasks)



 
module.exports = router
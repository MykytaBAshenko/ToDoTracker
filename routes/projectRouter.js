const router = require('express').Router()
const projectCtrl = require('../controllers/projectCtrl')
const auth = require('../middleware/auth')


router.get('/get/:projectLink',auth, projectCtrl.getProject)
router.post('/new',auth, projectCtrl.createProject)
router.post('/uploadlogo',auth, projectCtrl.uploadLogo)


 
module.exports = router
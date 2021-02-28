const router = require('express').Router()
const projectCtrl = require('../controllers/projectCtrl')
const auth = require('../middleware/auth')

router.post('/',auth, projectCtrl.createProject)

 
module.exports = router
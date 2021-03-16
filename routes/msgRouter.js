const router = require('express').Router()
const userCtrl = require('../controllers/msgCtrl')
const auth = require('../middleware/auth')

router.get('/:projectLink', userCtrl.get100msg)




module.exports = router
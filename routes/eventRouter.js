const router = require('express').Router()
const eventCtrl = require('../controllers/eventCtrl')
const auth = require('../middleware/auth')


router.post('/uploadphoto',auth, eventCtrl.uploadImage)
router.post('/create/:companyLink',auth, eventCtrl.createEvent)
router.get('/nonapproved',auth, eventCtrl.getNonApproved)
router.get('/',auth, eventCtrl.getEvents)

router.post('/approve', auth, eventCtrl.approveEvent)
router.post('/remove', auth, eventCtrl.dropEvent)




 
 
module.exports = router
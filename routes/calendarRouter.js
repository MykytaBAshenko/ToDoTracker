const router = require('express').Router()
const calendarCtrl = require('../controllers/calendarCtrl')
const auth = require('../middleware/auth')

// router.post('/task/:taskId',auth, commentsCtrl.createComment)
// router.delete('/:taskId/comment/:commentId',auth, commentsCtrl.dropComment)
// router.put('/:taskId/comment/:commentId',auth, commentsCtrl.upadteComment)

router.get('/', auth, calendarCtrl.getCalendar)
router.put('/:calendarId', auth, calendarCtrl.updateCalendar)
router.get('/one/:calendarId', auth, calendarCtrl.getCalendarForEditing)
router.post('/checkemail', auth, calendarCtrl.checkIfExistEmail)
router.post('/new', auth, calendarCtrl.createNewCalendar)
router.post('/uploadphoto', auth, calendarCtrl.uploadImage)
router.delete('/:calendarId', auth, calendarCtrl.deleteCalendar)








module.exports = router
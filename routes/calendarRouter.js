const router = require('express').Router()
const calendarCtrl = require('../controllers/calendarCtrl')
const auth = require('../middleware/auth')

// router.post('/task/:taskId',auth, commentsCtrl.createComment)
// router.delete('/:taskId/comment/:commentId',auth, commentsCtrl.dropComment)
// router.put('/:taskId/comment/:commentId',auth, commentsCtrl.upadteComment)

router.get('/', auth, calendarCtrl.getCalendar)
router.post('/checkemail', auth, calendarCtrl.checkIfExistEmail)







module.exports = router
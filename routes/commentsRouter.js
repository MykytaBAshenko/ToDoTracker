const router = require('express').Router()
const commentsCtrl = require('../controllers/commentsCtrl')
const auth = require('../middleware/auth')

router.get('/task/:taskId',auth, commentsCtrl.getComments)
router.post('/task/:taskId',auth, commentsCtrl.createComment)
router.delete('/:taskId/comment/:commentId',auth, commentsCtrl.dropComment)
router.put('/:taskId/comment/:commentId',auth, commentsCtrl.upadteComment)







module.exports = router
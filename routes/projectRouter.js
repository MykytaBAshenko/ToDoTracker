const router = require('express').Router()
const projectCtrl = require('../controllers/projectCtrl')
const auth = require('../middleware/auth')

router.get('/',auth, projectCtrl.getProjects)
router.get('/get/:projectLink',auth, projectCtrl.getProject)
router.post('/:projectLink/adduser',auth, projectCtrl.addUser)
router.get('/:projectLink/users',auth, projectCtrl.getUsers)
router.post('/new',auth, projectCtrl.createProject)
router.post('/uploadlogo',auth, projectCtrl.uploadLogo)
router.delete('/:projectLink/user/:userId',auth, projectCtrl.deleteUser)
router.get('/:projectId/users/:userId',auth, projectCtrl.getUserInfo)


 
module.exports = router
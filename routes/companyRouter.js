const router = require('express').Router()
const companyCtrl = require('../controllers/companyCtrl')
const auth = require('../middleware/auth')

router.get('/',auth, companyCtrl.getCompanys)
router.get('/get/:companyLink',auth, companyCtrl.getCompany)
router.post('/:companyLink/adduser',auth, companyCtrl.addUser)
router.get('/:companyLink/users',auth, companyCtrl.getUsers)
router.post('/new',auth, companyCtrl.createCompany)
router.post('/uploadlogo',auth, companyCtrl.uploadLogo)
router.delete('/:companyLink/user/:userId',auth, companyCtrl.deleteUser)
// router.get('/:projectId/users/:userId',auth, projectCtrl.getUserInfo)
// router.delete('/:projectId',auth, projectCtrl.deleteProject)
// router.put('/:projectId',auth, projectCtrl.upadteProject)
// router.put('/:projectId/user/:userIdInPr',auth, projectCtrl.patchUserInProject)



 
module.exports = router
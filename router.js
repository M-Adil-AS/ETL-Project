const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

router.get('/', userController.home)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/update', userController.mustBeLoggedIn ,userController.update)
router.get('/api', userController.api)

module.exports = router
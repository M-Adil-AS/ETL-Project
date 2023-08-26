const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const processController = require('./controllers/processController')

router.get('/', userController.home)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/exoplanets_screen', userController.exoplanets_screen)

router.post('/ETL', userController.mustBeLoggedIn, processController.ETL)
router.get('/exoplanets', processController.exoplanets)

module.exports = router
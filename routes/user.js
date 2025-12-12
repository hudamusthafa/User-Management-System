const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const auth = require('../middleware/auth')


// LOGIN PAGE
router.get('/login',auth.isLogin,userController.loadLogin)
router.post('/login',userController.login)
//})

// REGISTER PAGE
router.get('/register',auth.isLogin,userController.loadRegister)
 // res.render('user/register',{message:""})
//})

// REGISTER POST
router.post('/register',userController.registerUser)

//home page
router.get('/home',auth.checkSession,userController.loadHome)

//logout
router.get('/logout',auth.checkSession,userController.logout)
module.exports = router 
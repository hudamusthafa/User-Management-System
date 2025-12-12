const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const noCache = require('../middleware/noCache');

// LOGIN PAGE
router.get('/login', auth.isLogin, userController.loadLogin);
router.post('/login', userController.login);

// REGISTER PAGE
router.get('/register', auth.isLogin, userController.loadRegister);
router.post('/register', userController.registerUser);

// HOME PAGE (requires login + no cache)
router.get('/home', auth.checkSession, noCache, userController.loadHome);

// LOGOUT (prevents back button from showing home page)
router.get('/logout', auth.checkSession, noCache, userController.logout);

module.exports = router;

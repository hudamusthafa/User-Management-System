const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')

router.get("/login",adminAuth.isLogin,adminController.loadLogin)
router.post("/login",adminController.login)
router.get("/dashboard",adminAuth.checkSession,adminController.loadDashboard)




// Save new user (POST)
router.post("/addUser", adminAuth.checkSession, adminController.addUser);
// Show Add User Page

router.get("/addUserPage", adminAuth.checkSession, adminController.loadAddUserPage);

// Delete user
router.get("/delete/:id", adminAuth.checkSession, adminController.deleteUser);

// Search user
router.get("/search", adminAuth.checkSession, adminController.searchUser);

// Logout
router.get("/logout", adminController.logout);

//Edit User Page
router.get('/edit/:id', adminAuth.checkSession, adminController.loadEditPage);
//Update User
router.post('/edit/:id', adminAuth.checkSession, adminController.updateUser);











module.exports = router
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const adminAuth = require('../middleware/adminAuth');
const noCache = require('../middleware/noCache');

// LOGIN PAGE
router.get("/login", adminAuth.isLogin, adminController.loadLogin);
router.post("/login", adminController.login);

// DASHBOARD
router.get("/dashboard", adminAuth.checkSession, noCache, adminController.loadDashboard);

// ADD USER PAGE
router.get("/addUserPage", adminAuth.checkSession, noCache, adminController.loadAddUserPage);

// SAVE NEW USER
router.post("/addUser", adminAuth.checkSession, noCache, adminController.addUser);

// DELETE USER
router.get("/delete/:id", adminAuth.checkSession, noCache, adminController.deleteUser);

// SEARCH USER
router.get("/search", adminAuth.checkSession, noCache, adminController.searchUser);

// EDIT USER PAGE
//router.get("/edit/:id", adminAuth.checkSession, noCache, adminController.loadEditPage);
router.get("/edit/:id", adminAuth.checkSession, noCache, async (req, res) => {
    await adminController.loadEditPage(req, res);

    // 🔥 Prevent this edit page from being stored in browser history
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
});

// UPDATE USER
router.post("/edit/:id", adminAuth.checkSession, noCache, adminController.updateUser);

// LOGOUT
router.get("/logout", adminController.logout);

module.exports = router;

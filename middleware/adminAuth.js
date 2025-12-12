// middleware/adminAuth.js

// Prevent already logged-in admin from seeing login page
const isLogin = (req, res, next) => {
  if (req.session.admin) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

// Allow only admin session & disable caching
const checkSession = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/admin/login');
  }

  // 🔥 Prevent cached dashboard from appearing after logout
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
};

module.exports = { checkSession, isLogin };

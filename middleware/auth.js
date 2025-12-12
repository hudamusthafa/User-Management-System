// middleware/auth.js

// Prevent already logged-in users from accessing login/register
const isLogin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/user/home');
  }
  next();
};

// Allow only authenticated users & disable caching
const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/user/login');
  }

  // 🔥 Prevent browser from loading old cached pages when user logs out
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
};

module.exports = { checkSession, isLogin };

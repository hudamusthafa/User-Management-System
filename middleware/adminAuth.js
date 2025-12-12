const checkSession  = (req, res, next) => {
  if (req.session.admin) {
    // User logged in → allow home page
    return next();
  } else {
    // Not logged in → send to login
    return res.redirect('/admin/login');
  }
}

const isLogin = (req, res, next) => {
  if (req.session.admin) {
    // Already logged in → don't allow login/register
    return res.redirect('/admin/dashboard');
  } else {
    return next();
  }
}

module.exports = { checkSession, isLogin };
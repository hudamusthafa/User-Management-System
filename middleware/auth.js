const checkSession  = (req, res, next) => {
  if (req.session.user) {
    // User logged in → allow home page
    return next();
  } else {
    // Not logged in → send to login
    return res.redirect('/user/login');
  }
}

const isLogin = (req, res, next) => {
  if (req.session.user) {
    // Already logged in → don't allow login/register
    return res.redirect('/user/home');
  } else {
    return next();
  }
}

module.exports = { checkSession, isLogin };
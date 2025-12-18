module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.admin) {
      return next();
    }
    res.redirect('/admin/login');
  },

  forwardAdmin: (req, res, next) => {
    if (req.session && req.session.admin) {
      return res.redirect('/admin');
    }
    next();
  }
};

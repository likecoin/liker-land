function authenticateLogin(req, res, next) {
  const { user, version } = req.session;
  if (!user || version !== 2) {
    res.sendStatus(401);
    return;
  }
  next();
}

module.exports = {
  authenticateLogin,
};

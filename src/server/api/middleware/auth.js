function authenticateV2Login(req, res, next) {
  const { user, version } = req.session;
  if (!user || version !== 2) {
    res.sendStatus(401);
    return;
  }
  next();
}

function checkParamWalletMatch(req, res, next) {
  const { user } = req.session;
  const { wallet } = req.params;
  if (user !== wallet) {
    res.status(400).send('ADDRESS_MISMATCH');
    return;
  }
  next();
}

module.exports = {
  authenticateV2Login,
  checkParamWalletMatch,
};

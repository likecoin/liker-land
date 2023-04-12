const { walletUserCollection } = require('../../modules/firebase');
const { setPrivateCacheHeader } = require('../middleware/cache');

function authenticateV2Login(req, res, next) {
  const { user, version } = req.session;
  if (!user || version !== 2) {
    res.sendStatus(401);
    return;
  }
  setPrivateCacheHeader(res);
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

async function checkEmailHasVerified(req, res, next) {
  const { user } = req.session;
  const userDoc = await walletUserCollection.doc(user).get();
  const { email, emailUnconfirmed } = userDoc.data();
  if (!email) {
    if (emailUnconfirmed) {
      res.status(403).send('EMAIL_UNCONFIRMED');
    } else {
      res.status(403).send('EMAIL_NOT_SET_YET');
    }
    return;
  }
  next();
}

module.exports = {
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
};

const { Router } = require('express');
const { walletUserCollection } = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');

const router = Router();

router.get('/event/seen', authenticateV2Login, async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    await walletUserCollection.doc(user).update({
      eventLastSeenTs: firestore.FieldValue.serverTimestamp(),
    });
    res.sendStatus(200);
  } catch (err) {
    if (req.session) req.session = null;
    res.clearCookie(AUTH_COOKIE_NAME, CLEAR_AUTH_COOKIE_OPTION);
    next(err);
  }
});

module.exports = router;

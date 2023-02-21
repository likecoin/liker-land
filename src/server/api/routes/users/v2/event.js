const { Router } = require('express');
const {
  walletUserCollection,
  Timestamp,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');

const router = Router();

function isValidTs(ts, lastSeenTs) {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(ts) || ts % 1000 !== 0) {
    return false;
  }
  if (ts < lastSeenTs) {
    return false;
  }
  if (ts > Date.now() + 5 * 60 * 1000) {
    return false;
  }
  return true;
}

router.post('/event/seen', authenticateV2Login, async (req, res, next) => {
  const { ts } = req.body;
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    const { eventLastSeenTs } = userDoc.data();
    if (!isValidTs(ts, eventLastSeenTs)) {
      res.status(400).send('INVALID_TIMESTAMP_PROVIDED');
      return;
    }
    await walletUserCollection.doc(user).update({
      eventLastSeenTs: Timestamp.fromMillis(Math.floor(ts / 1000) * 1000),
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserSeenLikerLandNotificationsPage',
      user,
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

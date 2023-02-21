const { Router } = require('express');
const {
  db,
  walletUserCollection,
  Timestamp,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');

const router = Router();

function isValidTs(ts, lastSeenTs) {
  return (
    !(Number.isNaN(ts) || ts % 1000 !== 0) &&
    ts > lastSeenTs &&
    ts < Date.now() + 5 * 60 * 1000
  );
}

router.post('/event/seen', authenticateV2Login, async (req, res, next) => {
  const { ts } = req.body;
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
      const userDoc = await t.get(userRef);
      const { eventLastSeenTs = 1000 } = userDoc.data();
      if (!isValidTs(ts, eventLastSeenTs)) {
        throw new Error('INVALID_TIMESTAMP_PROVIDED');
      }
      t.update(userRef, {
        eventLastSeenTs: Timestamp.fromMillis(Math.floor(ts / 1000) * 1000),
      });
    });

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'UserSeenLikerLandNotificationsPage',
      user,
    });
    res.sendStatus(200);
  } catch (err) {
    switch (err.message) {
      case 'INVALID_TIMESTAMP_PROVIDED':
        res.status(400).send('INVALID_TIMESTAMP_PROVIDED');
        break;
      default:
        next(err);
    }
  }
});

module.exports = router;

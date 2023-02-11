const { Router } = require('express');
const {
  walletUserCollection,
  FieldValue,
} = require('../../../../modules/firebase');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { publisher, PUBSUB_TOPIC_MISC } = require('../../../../modules/pubsub');

const router = Router();

router.post('/event/seen', authenticateV2Login, async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    await walletUserCollection.doc(user).update({
      eventLastSeenTs: FieldValue.serverTimestamp(),
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

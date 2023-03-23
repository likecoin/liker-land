const { Router } = require('express');
const {
  authenticateV2Login,
  checkEmailHasVerified,
} = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { walletUserCollection } = require('../../../../modules/firebase');

const router = Router();

router.get('/notification', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    const { notification = {} } = userDoc.data();
    const { transfer = true, purchasePrice = 0 } = notification;
    res.json({
      notification: {
        transfer,
        purchasePrice,
      },
    });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post(
  '/notification',
  authenticateV2Login,
  checkEmailHasVerified,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { user } = req.session;
      const { transfer, purchasePrice } = req.body;

      const payload = {};

      if (transfer !== undefined) {
        if (typeof transfer !== 'boolean') {
          res.status(400).send('INVALID_NOTIFICATION_SETTING_FOR_TRANSFER');
          return;
        }
        payload.transfer = transfer;
      }
      if (purchasePrice !== undefined) {
        if (typeof purchasePrice !== 'number') {
          res.status(400).send('INVALID_NOTIFICATION_SETTING_FOR_PURCHASE');
          return;
        }
        payload.purchasePrice = purchasePrice;
      }

      await walletUserCollection.doc(user).update({ notification: payload });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;

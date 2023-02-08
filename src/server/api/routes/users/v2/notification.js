const { Router } = require('express');
const {
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
} = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { walletUserCollection } = require('../../../../modules/firebase');

const router = Router();

router.get(
  '/:wallet/notification',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res, next) => {
    try {
      const { wallet: user } = req.params;
      const userDoc = await walletUserCollection.doc(user).get();
      const { notification = {} } = userDoc.data();
      const { transfer = true } = notification;
      res.json({
        notification: {
          transfer,
        },
      });
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

router.post(
  '/:wallet/notification',
  authenticateV2Login,
  checkParamWalletMatch,
  checkEmailHasVerified,
  async (req, res, next) => {
    try {
      setPrivateCacheHeader(res);
      const { wallet: user } = req.params;
      const { notification } = req.body;
      if (!notification) {
        res.status(400).send('MISSING_NOTIFICATION_SETTING');
        return;
      }
      const { transfer } = notification;
      if (typeof transfer !== 'boolean') {
        res.status(400).send('INVALID_NOTIFICATION_SETTING');
        return;
      }
      await walletUserCollection.doc(user).update({
        notification: {
          transfer,
        },
      });
      res.sendStatus(200);
    } catch (err) {
      handleRestfulError(req, res, next, err);
    }
  }
);

module.exports = router;

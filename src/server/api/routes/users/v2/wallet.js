const { Router } = require('express');
const { walletUserCollection } = require('../../../../modules/firebase');
const { GET_WALLET_API_SECRET } = require('../../../../config/config');

const router = Router();

router.get('/wallet', async (req, res, next) => {
  try {
    const key = req.headers['x-likerland-api-key'];
    const { email } = req.query;
    if (!email) {
      res.status(400).send('MISSING_EMAIL');
      return;
    }
    if (!key || key !== GET_WALLET_API_SECRET) {
      res.status(403).send('INVALID_KEY');
      return;
    }
    const userDoc = await walletUserCollection
      .where('email', '==', email)
      .limit(1)
      .get();
    if (userDoc.empty) {
      res.status(404).send('WALLET_NOT_FOUND');
      return;
    }
    const wallet = userDoc.docs[0].id;
    res.json({ wallet });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

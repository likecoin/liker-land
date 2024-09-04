const { Router } = require('express');
const { walletUserCollection } = require('../../../../modules/firebase');
const { GET_WALLET_API_SECRET } = require('../../../../config/config');

const router = Router();

router.get('/wallet', async (req, res, next) => {
  try {
    const key = req.headers['x-likerland-api-key'];
    const { email, wallet } = req.query;
    if (email && wallet) {
      res.status(400).send('INVALID_QUERY');
      return;
    }
    if (!key || key !== GET_WALLET_API_SECRET) {
      res.status(403).send('INVALID_KEY');
      return;
    }
    let userDoc;
    if (wallet) {
      userDoc = await walletUserCollection.doc(wallet).get();
      if (!userDoc.exists) {
        res.status(404).send('USER_NOT_FOUND');
        return;
      }
    } else if (email) {
      const userQuery = await walletUserCollection
        .where('email', '==', email)
        .limit(1)
        .get();
      if (userQuery.empty) {
        res.status(404).send('USER_NOT_FOUND');
        return;
      }
      [userDoc] = userQuery.docs;
    } else {
      res.status(400).send('MISSING_QUERY');
      return;
    }
    const userWallet = userDoc.id;
    const { lastLoginMethod, registerLoginMethod } = userDoc.data();
    res.json({
      wallet: userWallet,
      lastLoginMethod,
      registerLoginMethod,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

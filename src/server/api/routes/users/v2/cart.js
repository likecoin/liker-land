const { Router } = require('express');

const { authenticateV2Login } = require('../../../middleware/auth');
const {
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');

const router = Router();

router.get('/cart', authenticateV2Login, async (req, res) => {
  const { user } = req.session;
  const cartDoc = await walletUserCollection.doc(user).get();
  const { cart } = cartDoc.data();
  res.json({ cart: cart || [] });
});

router.post('/cart', authenticateV2Login, async (req, res) => {
  const { user } = req.session;
  const { cart: inputCart } = req.body;
  if (!Array.isArray(inputCart)) {
    res.status(400).send('INVALID_CART');
    return;
  }
  const cart = Object.values(
    inputCart.reduce((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {})
  ).map(item => {
    const {
      productId,
      collectionId,
      classId,
      coupon,
      customPriceInDecimal,
      from,
      timestamp,
      quantity,
      priceIndex,
    } = item;
    return JSON.parse(
      JSON.stringify({
        productId,
        collectionId,
        classId,
        coupon,
        customPriceInDecimal,
        from,
        timestamp,
        quantity,
        priceIndex,
      })
    );
  });
  await walletUserCollection.doc(user).update({
    cart: cart?.length ? cart : FieldValue.delete(),
    cartUpdateTimestamp: FieldValue.serverTimestamp(),
  });
  res.sendStatus(200);
});

router.delete('/cart', authenticateV2Login, async (req, res) => {
  const { user } = req.session;
  await walletUserCollection.doc(user).update({
    cart: FieldValue.delete(),
    cartUpdateTimestamp: FieldValue.serverTimestamp(),
  });
  res.sendStatus(200);
});

module.exports = router;

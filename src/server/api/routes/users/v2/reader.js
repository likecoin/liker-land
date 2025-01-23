const { Router } = require('express');
const { authenticateV2Login } = require('../../../middleware/auth');
const {
  walletUserCollection,
  FieldValue,
} = require('../../../../modules/firebase');

const router = Router();

router.get('/reader/epub/cfi', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { class_id: classId, nft_id: nftId, index } = req.query;
    if (!classId || !nftId || !index) {
      res.status(400).send('MISSING_PARAMS');
    }
    const key = `${classId}-${nftId}-${index}`;
    const readerDoc = await walletUserCollection
      .doc(user)
      .collection('reader')
      .doc(key)
      .get();
    if (!readerDoc.exists) {
      res.json({});
      return;
    }
    const { currentCfi, lastUpdateTimestamp } = readerDoc.data();
    res.json({
      currentCfi,
      lastUpdateTimestamp: lastUpdateTimestamp?.toMillis(),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/reader/epub/cfi', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const { class_id: classId, nft_id: nftId, index } = req.query;
    const { currentCfi } = req.body;
    if (!classId || !nftId || !index) {
      res.status(400).send('MISSING_PARAMS');
    }
    if (!currentCfi) {
      res.status(400).send('MISSING_BODY');
    }
    const key = `${classId}-${nftId}-${index}`;
    await walletUserCollection
      .doc(user)
      .collection('reader')
      .doc(key)
      .set(
        {
          classId,
          nftId,
          index,
          type: 'epub',
          currentCfi,
          lastUpdateTimestamp: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

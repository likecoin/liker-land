const axios = require('axios');
const { Router } = require('express');

const { handleRestfulError } = require('../../middleware/error');

const {
  LIKECOIN_CHAIN_API,
  LIKECOIN_API_BASE,
} = require('../../../config/config');

const router = Router();

router.get('/nft/metadata', async (req, res, next) => {
  try {
    const { class_id: classId } = req.query;
    if (!classId) {
      res.status(400).send('MISSING_CLASS_ID');
      return;
    }

    const [
      classInfoRes,
      ownerInfoRes,
      listingInfoRes,
      purchaseInfoRes,
    ] = await Promise.all([
      axios.get(`${LIKECOIN_CHAIN_API}/cosmos/nft/v1beta1/classes/${classId}`),
      axios.get(
        `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/owner?class_id=${classId}`
      ),
      axios.get(
        `${LIKECOIN_CHAIN_API}/likechain/likenft/v1/listings/${classId}`
      ),
      axios.get(`${LIKECOIN_API_BASE}/likernft/purchase?class_id=${classId}`),
    ]);
    res.json({
      classInfo: classInfoRes.data,
      ownerInfo: ownerInfoRes.data,
      listingInfo: listingInfoRes.data,
      purchaseInfo: purchaseInfoRes.data,
    });
    return;
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;

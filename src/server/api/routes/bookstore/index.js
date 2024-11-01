const { Router } = require('express');

const { IS_TESTNET } = require('../../../config/config');

const {
  fetchAirtableCMSProductsByTagId,
  fetchAirtableCMSTags,
} = require('../../util/airtable');

const { handleRestfulError } = require('../../middleware/error');

const router = Router();

router.get('/bookstore/tags', async (req, res, next) => {
  try {
    const { limit: pageSize, offset } = req.query;
    const result = await fetchAirtableCMSTags({
      pageSize,
      offset,
    });

    if (!IS_TESTNET) {
      res.set(
        'Cache-Control',
        'public, max-age=3600, stale-if-error=604800, stale-while-revalidate=604800'
      );
    }

    res.json(result);
  } catch (error) {
    handleRestfulError(req, res, next, error);
  }
});

router.get('/bookstore/products', async (req, res, next) => {
  try {
    const { limit: pageSize, offset, tag } = req.query;

    const tagId = tag || 'all';

    const result = await fetchAirtableCMSProductsByTagId(tagId, {
      pageSize,
      offset,
    });

    if (!IS_TESTNET) {
      res.set(
        'Cache-Control',
        'public, max-age=3600, stale-if-error=604800, stale-while-revalidate=604800'
      );
    }

    res.json(result);
  } catch (error) {
    if (error.response?.status === 422) {
      res.status(404).send('TAG_NOT_FOUND');
      return;
    }

    handleRestfulError(req, res, next, error);
  }
});

module.exports = router;

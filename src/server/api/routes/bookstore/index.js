const { Router } = require('express');

const { fetchAirtableCMSItems } = require('../../util/airtable');

const { handleRestfulError } = require('../../middleware/error');

const router = Router();

router.get('/bookstore/lists/:id', async (req, res, next) => {
  try {
    const { limit: pageSize, offset } = req.query;

    const result = await fetchAirtableCMSItems(req.params.id, {
      pageSize,
      offset,
    });

    res.set(
      'Cache-Control',
      'public, max-age=3600, stale-if-error=604800, stale-while-revalidate=604800'
    );

    res.json(result);
  } catch (error) {
    handleRestfulError(req, res, next, error);
  }
});

module.exports = router;

const { Router } = require('express');
const { authenticateV2Login } = require('../../../middleware/auth');
const { setPrivateCacheHeader } = require('../../../middleware/cache');
const { handleRestfulError } = require('../../../middleware/error');
const { walletUserCollection } = require('../../../../modules/firebase');

const config = require('../../../../../nuxt.config');

const DEFAULT_LOCALE = config.i18n.defaultLocale;
const AVAILABLE_LOCALES = config.i18n.locales.map(l => l.code);

const router = Router();

router.get('/locale', authenticateV2Login, async (req, res, next) => {
  try {
    const { user } = req.session;
    const userDoc = await walletUserCollection.doc(user).get();
    if (!userDoc.exists) {
      res.json({ locale: DEFAULT_LOCALE });
      return;
    }
    const { locale = DEFAULT_LOCALE } = userDoc.data();
    res.json({ locale });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.post('/locale', authenticateV2Login, async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    const { user } = req.session;
    const { locale } = req.body;
    if (!locale || !AVAILABLE_LOCALES.includes(locale)) {
      res.status(400).send('INVALID_LOCALE');
      return;
    }
    await walletUserCollection.doc(user).update({
      locale,
    });
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;

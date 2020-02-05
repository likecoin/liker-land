const { Router } = require('express');
const parse = require('url-parse');
const { FieldValue, userCollection } = require('../../util/firebase');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { apiPostArticleForInfo } = require('../../util/api');

const router = Router();

router.get('/reader/bookmark', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const userDoc = await userCollection.doc(req.session.user).get();
    const { bookmarks = [] } = userDoc.data();
    res.json({ bookmarks });
  } catch (err) {
    next(err);
  }
});

router.post('/reader/bookmark', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { url } = req.query;
    if (!url) {
      res.sendStatus(400);
      return;
    }
    try {
      parse(url);
    } catch (err) {
      res.sendStatus(400);
      return;
    }
    await apiPostArticleForInfo(url, req);
    const userRef = userCollection.doc(req.session.user);
    await userRef.update({
      bookmarks: FieldValue.arrayUnion(url),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/reader/bookmark', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { url } = req.query;
    if (!url) {
      res.sendStatus(400);
      return;
    }
    try {
      parse(url);
    } catch (err) {
      res.sendStatus(400);
      return;
    }
    const userRef = userCollection.doc(req.session.user);
    await userRef.update({
      bookmarks: FieldValue.arrayRemove(url),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

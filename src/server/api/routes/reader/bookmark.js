const { Router } = require('express');
const { apiFetchArticleDetail } = require('../../util/api');
const { FieldValue, userCollection } = require('../../util/firebase');

const router = Router();

router.get('/reader/bookmark', async (req, res, next) => {
  try {
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
      await apiFetchArticleDetail(url);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          res.sendStatus(404);
          return;
        }
      }
      next(err);
      return;
    }
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
      await apiFetchArticleDetail(url);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          res.sendStatus(404);
          return;
        }
      }
      next(err);
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

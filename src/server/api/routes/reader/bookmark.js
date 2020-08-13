const { Router } = require('express');
const parse = require('url-parse');
const { FieldValue, userCollection } = require('../../util/firebase');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const {
  apiFetchBookmarks,
  apiPostBookmarks,
  apiDeleteBookmarks,
} = require('../../util/api');

const router = Router();

router.get('/reader/bookmark', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const [userDoc, apiBookmarks] = await Promise.all([
      userCollection.doc(req.session.user).get(),
      apiFetchBookmarks(req),
    ]);
    const { bookmarks = [] } = userDoc.data();
    const outputList = [];
    const bookmarksSet = new Set();
    bookmarks.forEach(b => {
      if (!bookmarksSet.has(b)) {
        outputList.push(b);
        bookmarksSet.add(b);
      }
    });
    if (apiBookmarks.data.list) {
      const { list } = apiBookmarks.data;
      list.sort((a, b) => a.ts - b.ts).forEach(b => {
        if (!bookmarksSet.has(b.url)) {
          outputList.push(b.url);
          bookmarksSet.add(b.url);
        }
      });
    }
    res.json({ bookmarks: outputList });
  } catch (err) {
    next(err);
  }
});

router.post('/reader/bookmark', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
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
    try {
      await apiPostBookmarks(url, req);
    } catch (err) {
      if (!(err.response && err.response.data === 'URL_NOT_FOUND')) {
        throw err;
      }
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/reader/bookmark', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
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
    try {
      await apiDeleteBookmarks(url, req);
    } catch (err) {
      if (!(err.response && err.response.data === 'URL_NOT_FOUND')) {
        throw err;
      }
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

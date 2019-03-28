const { Router } = require('express');
const {
  apiFetchLikedUser,
  apiFetchUserPublicProfile,
  apiFetchUserArticles,
  apiFetchSuggestedArticles,
  apiFetchArticleDetail,
} = require('../util/api');
const { FieldValue, userCollection } = require('../util/firebase');

const router = Router();

router.get('/reader/index', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const [{ data }, userDoc] = await Promise.all([
      apiFetchLikedUser(req),
      userCollection.doc(req.session.user).get(),
    ]);
    const userSet = new Set(data.list);
    const { subscribedUsers = [], unsubscribedUsers = [] } = userDoc.data();
    subscribedUsers.forEach(u => userSet.add(u));
    unsubscribedUsers.forEach(u => userSet.delete(u));
    res.json({ list: Array.from(userSet), unsubscribedUsers });
  } catch (err) {
    next(err);
  }
});

router.post('/reader/subscribe/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { id } = req.params;
    try {
      await apiFetchUserPublicProfile(id);
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
      subscribedUsers: FieldValue.arrayUnion(id),
      unsubscribedUsers: FieldValue.arrayRemove(id),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/reader/subscribe/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { id } = req.params;
    try {
      await apiFetchUserPublicProfile(id);
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
      subscribedUsers: FieldValue.arrayRemove(id),
      unsubscribedUsers: FieldValue.arrayUnion(id),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/reader/suggest', async (req, res, next) => {
  try {
    const { data } = await apiFetchSuggestedArticles();
    let list = data.editorial.concat(data.pick); // only get editorial and pick list, ignore mostLike
    list = await Promise.all(
      // fetch url data server side
      list.map(url =>
        apiFetchArticleDetail(url)
          .then(r => ({ url, ...r.data }))
          .catch(() => ({}))
      )
    );
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/user/:user', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { data } = await apiFetchUserArticles(req.params.user, req);
    let { list } = data;
    list = await Promise.all(
      // fetch url data server side
      list.map(i =>
        apiFetchArticleDetail(i.url)
          .then(r => ({ ...i, ...r.data }))
          .catch(e => ({}))
      )
    );
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

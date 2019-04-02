const { Router } = require('express');
const {
  apiFetchLikedUser,
  apiFetchUserArticles,
  apiFetchSuggestedArticles,
} = require('../../util/api');
const { userCollection } = require('../../util/firebase');
const follow = require('./follow');

const router = Router();

router.use(follow);

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
    const { followedUsers = [], unfollowedUsers = [] } = userDoc.data();
    followedUsers.forEach(u => userSet.add(u));
    unfollowedUsers.forEach(u => userSet.delete(u));
    res.json({ list: Array.from(userSet), unfollowedUsers });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/suggest/works', async (req, res, next) => {
  try {
    const { data } = await apiFetchSuggestedArticles();
    let list = data.editorial.concat(data.pick); // only get editorial and pick list, ignore mostLike
    list = list.map(url => ({ referrer: url, url }));
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/user/:user/works', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { data } = await apiFetchUserArticles(req.params.user, req);
    let { list } = data;
    list = list.map(i => {
      const { referrer, url, ts } = i;
      return {
        referrer,
        url,
        ts,
      };
    });
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

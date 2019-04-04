const { Router } = require('express');
const {
  apiFetchLikedUser,
  apiFetchUserArticles,
  apiFetchSuggestedArticles,
} = require('../../util/api');
const { userCollection } = require('../../util/firebase');
const follow = require('./follow');
const bookmark = require('./bookmark');

const router = Router();

router.use(follow);
router.use(bookmark);

function filterArticleList(list) {
  return list.map(i => {
    const { referrer, url, user, ts } = i;
    return {
      referrer,
      url: referrer.toLowerCase() === url.toLowerCase() ? undefined : url,
      user,
      ts,
    };
  });
}

async function getFollowedUserListInfo(req) {
  const [{ data }, userDoc] = await Promise.all([
    apiFetchLikedUser(req),
    userCollection.doc(req.session.user).get(),
  ]);
  const userSet = new Set(data.list);
  const { followedUsers = [], unfollowedUsers = [] } = userDoc.data();
  followedUsers.forEach(u => userSet.add(u));
  unfollowedUsers.forEach(u => userSet.delete(u));
  return { followedUsers: Array.from(userSet), unfollowedUsers };
}

router.get('/reader/index', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { followedUsers, unfollowedUsers } = await getFollowedUserListInfo(
      req
    );
    res.json({ list: followedUsers, unfollowedUsers });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/works/suggest', async (req, res, next) => {
  try {
    const { data } = await apiFetchSuggestedArticles();
    let list = data.editorial.concat(data.pick); // only get editorial and pick list, ignore mostLike
    list = list.map(url => ({ referrer: url }));
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/works/followed', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { limit = 40 } = req.query;
    /* TODO: fix this HACK on hardcode 20 articles/user limit */
    const userArticleLimit = Math.min(limit, 20);
    const { followedUsers: userList } = await getFollowedUserListInfo(req);
    let articleLists = await Promise.all(
      userList.map(u =>
        apiFetchUserArticles(u, userArticleLimit)
          .then(r => r.data.list)
          .catch(e => {})
      )
    );
    articleLists = articleLists.filter(a => a && a.length);
    const articles = articleLists.reduce((acc, list) => {
      if (!list || !list.length) return acc;
      return acc.concat(filterArticleList(list));
    }, []);
    articles.sort((a, b) => b.ts - a.ts).splice(limit);
    res.json({ list: articles });
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
    const { limit = 20 } = req.query;
    const { data } = await apiFetchUserArticles(req.params.user, limit);
    let { list } = data;
    list = filterArticleList(list);
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

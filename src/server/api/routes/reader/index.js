const { Router } = require('express');
const {
  apiFetchUserArticles,
  apiFetchUserSuperlike,
  apiFetchSuggestedArticles,
  apiFetchLatestSuperLike,
  apiFetchFollowedArticles,
  apiFetchFollowedUser,
  apiFetchFollowedSuperLikes,
} = require('../../util/api');
const { HALF_DAY_IN_S, ONE_DAY_IN_MS } = require('../../constant');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const follow = require('./follow');
const bookmark = require('./bookmark');

const router = Router();

router.use(follow);
router.use(bookmark);

function filterSuperLikeList(list) {
  return list.map(l => {
    const { id, shortId, likee, liker, ts, url } = l;
    return {
      superLikeID: id,
      superLikeShortID: shortId,
      referrer: url,
      ts,
      user: likee,
      liker,
    };
  });
}

function filterArticleList(list) {
  return list.map(i => {
    const { referrer, url: originalUrl, user, ts } = i;
    const url = originalUrl ? originalUrl.toLowerCase() : undefined;
    return {
      referrer,
      url: referrer && referrer.toLowerCase() === url ? undefined : originalUrl,
      user,
      ts,
    };
  });
}

async function getFollowedUserListInfo(req) {
  const { data: apiData } = await apiFetchFollowedUser(req);
  const { user } = req.session;
  const userSet = new Set();
  const unfollowedUserSet = new Set();
  if (apiData.list) {
    const apiFollowed = apiData.list.filter(a => a.isFollowed);
    const apiUnfollowed = apiData.list.filter(a => !a.isFollowed);
    apiFollowed.forEach(u => userSet.add(u.id));
    userSet.delete(user);
    apiUnfollowed.forEach(u => {
      userSet.delete(u.id);
      unfollowedUserSet.add(u.id);
    });
  }
  return {
    followedUsers: Array.from(userSet).sort(),
    unfollowedUsers: Array.from(unfollowedUserSet).sort(),
  };
}

router.get('/reader/index', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
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

router.get('/reader/superlike/latest', async (req, res, next) => {
  try {
    const { after, before, limit = 20 } = req.query;
    const { data } = await apiFetchLatestSuperLike({ after, before, limit });
    const list = filterSuperLikeList(data.list);
    list.sort((a, b) => b.ts - a.ts);
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/works/followed', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { after, before, limit = 40 } = req.query;
    /* TODO: fix this HACK on hardcode 20 articles/user limit */
    const { followedUsers: users } = await getFollowedUserListInfo(req);
    if (!users || !users.length) {
      res.json({ list: [] });
      return;
    }
    const { data } = await apiFetchFollowedArticles(users, {
      after,
      before,
      limit,
    });
    data.list.sort((a, b) => b.ts - a.ts).splice(limit);
    if (data.list.length && before && Date.now() - before > ONE_DAY_IN_MS) {
      res.set('Cache-Control', `private, max-age=${HALF_DAY_IN_S}`);
    }
    res.json({ list: data.list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/superlike/followed', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { after, before, limit = 20 } = req.query;
    const { followedUsers: users } = await getFollowedUserListInfo(req);
    if (!users || !users.length) {
      res.json({ list: [] });
      return;
    }
    const { data } = await apiFetchFollowedSuperLikes(users, {
      after,
      before,
      limit,
    });
    const list = filterSuperLikeList(data.list);
    list.sort((a, b) => b.ts - a.ts).splice(limit);
    if (data.list.length && before && Date.now() - before > ONE_DAY_IN_MS) {
      res.set('Cache-Control', `private, max-age=${HALF_DAY_IN_S}`);
    }
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/user/:user/works', async (req, res, next) => {
  try {
    const { after, before, limit = 20 } = req.query;
    const { data } = await apiFetchUserArticles(req.params.user, {
      after,
      before,
      limit,
    });
    let { list } = data;
    list = filterArticleList(list);
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/user/:user/superlike', async (req, res, next) => {
  try {
    const { after, before, limit = 20 } = req.query;
    const { data } = await apiFetchUserSuperlike(req.params.user, {
      after,
      before,
      limit,
    });
    let { list } = data;
    list = filterSuperLikeList(list);
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

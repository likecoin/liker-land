const { Router } = require('express');
const {
  apiFetchUserSuperlike,
  apiFetchSuggestedArticles,
  apiFetchPersonalSuggestedArticles,
  apiFetchLatestSuperLike,
  apiFetchFollowedUser,
  apiFetchFollowedSuperLikes,
} = require('../../util/api');
const {
  HALF_DAY_IN_S,
  ONE_DAY_IN_MS,
  DEFAULT_FOLLOW_IDS,
} = require('../../constant');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const { handleRestfulError } = require('../../middleware/error');
const bookmark = require('./bookmark');

const router = Router();

router.use(bookmark);

function filterSuperLikeList(list) {
  const items = [];
  list.forEach(l => {
    const { id, shortId, likee, liker, ts, url, superLikeIscnId } = l;
    try {
      // Guard malformed URI
      decodeURI(url);
      items.push({
        superLikeID: id,
        superLikeShortID: shortId,
        superLikeIscnId,
        referrer: url,
        ts,
        user: likee,
        liker,
      });
    } catch {
      // no-op
    }
  });
  return items;
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
    handleRestfulError(req, res, next, err);
  }
});

router.get('/reader/works/suggest', async (req, res, next) => {
  try {
    const { data } = await apiFetchSuggestedArticles();
    let list = data.editorial.concat(data.pick); // only get editorial and pick list, ignore mostLike
    if (!list || !list.length) {
      // HACK: fetch superlike feed from default follow if editorial bugged
      const { data: superLikeData } = await apiFetchFollowedSuperLikes(
        DEFAULT_FOLLOW_IDS,
        {
          limit: 20,
        }
      );
      list = filterSuperLikeList(superLikeData.list);
      list.sort((a, b) => b.ts - a.ts).splice(20);
    } else {
      list = list.map(url => ({ referrer: url }));
    }
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    next(err);
  }
});

router.get('/reader/works/suggest/personal', async (req, res, next) => {
  try {
    const { data } = await apiFetchPersonalSuggestedArticles(req);
    res.json({ list: data.personal });
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
    handleRestfulError(req, res, next, err);
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
    handleRestfulError(req, res, next, err);
  }
});

router.get('/reader/users/:user/superlike', async (req, res, next) => {
  try {
    const { after, before, limit = 20, filter } = req.query;
    const { data } = await apiFetchUserSuperlike(req.params.user, {
      after,
      before,
      limit,
      filter,
    });
    let { list } = data;
    list = filterSuperLikeList(list);
    res.set('Cache-Control', 'public, max-age=600');
    res.json({ list });
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;

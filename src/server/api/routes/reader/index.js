const { Router } = require('express');
const {
  apiFetchUserSuperlike,
  apiFetchFollowedUser,
} = require('../../util/api');
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

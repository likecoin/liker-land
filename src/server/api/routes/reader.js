const { Router } = require('express');
const {
  apiFetchLikedUser,
  apiFetchUserArticles,
  apiFetchSuggestedArticles,
  apiFetchArticleDetail,
} = require('../util/api');

const router = Router();

router.get('/reader/index', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    const { data } = await apiFetchLikedUser(req);
    res.json(data);
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
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

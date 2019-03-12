const { Router } = require('express');
const { apiFetchLikedUser, apiFetchUserArticles } = require('../util/api');

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

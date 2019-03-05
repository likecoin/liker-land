const axios = require('axios');
const { Router } = require('express');
const {
  getFetchLikedUserApi,
  getFetchUserArticlesAPI,
} = require('../util/api');

const router = Router();

router.get('/reader/index', async (req, res) => {
  if (!req.session.user) {
    res.sendStatus(403);
    return;
  }
  const { data } = await axios.get(getFetchLikedUserApi(), {
    headers: { Authorization: `Bearer ${req.session.accessToken}` },
  });
  res.json(data);
});

router.post('/reader/user/:user', async (req, res) => {
  if (!req.session.user) {
    res.sendStatus(403);
    return;
  }
  const { data } = await axios.get(getFetchUserArticlesAPI(req.params.user), {
    headers: { Authorization: `Bearer ${req.session.accessToken}` },
  });
  res.json(data);
});

module.exports = router;

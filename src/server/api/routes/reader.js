const axios = require('axios');
const { Router } = require('express');
const {
  apiRefreshAccessToken,
  getFetchLikedUserApi,
  getFetchUserArticlesAPI,
} = require('../util/api');

const router = Router();

router.get('/reader/index', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
      return;
    }
    let data;
    try {
      ({ data } = await axios.get(getFetchLikedUserApi(), {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (await apiRefreshAccessToken(req)) {
          ({ data } = await axios.get(getFetchLikedUserApi(), {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
          }));
        }
      } else {
        next(err);
      }
    }
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
    let data;
    try {
      ({ data } = await axios.get(getFetchUserArticlesAPI(req.params.user), {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      }));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (await apiRefreshAccessToken(req)) {
          ({ data } = await axios.get(
            getFetchUserArticlesAPI(req.params.user),
            {
              headers: { Authorization: `Bearer ${req.session.accessToken}` },
            }
          ));
        }
      } else {
        next(err);
      }
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

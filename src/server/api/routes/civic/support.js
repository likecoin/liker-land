const { Router } = require('express');
const { setPrivateCacheHeader } = require('../../middleware/cache');
const {
  apiCivicLikerListSupportingUser,
  apiCivicLikerGetSupportingUser,
  apiCivicLikerSupportUser,
  apiCivicLikerDeleteSuppoUser,
  apiCivicLikerGetMetadata,
} = require('../../util/api');

const router = Router();

router.get('/civic/support/users', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { data } = await apiCivicLikerListSupportingUser(req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/civic/support/self', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { data = {} } = await apiCivicLikerGetMetadata(req);
    res.json({ list: data.supporters || [] });
  } catch (err) {
    next(err);
  }
});

router.get('/civic/support/users/:id', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { id } = req.params;
    const { data } = await apiCivicLikerGetSupportingUser(id, req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post('/civic/support/users/:id', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { id } = req.params;
    const { quantity } = req.body;
    const { data } = await apiCivicLikerSupportUser(id, quantity, req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.delete('/civic/support/users/:id', async (req, res, next) => {
  try {
    setPrivateCacheHeader(res);
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { id } = req.params;
    const { data } = await apiCivicLikerDeleteSuppoUser(id, req);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

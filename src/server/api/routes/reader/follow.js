const { Router } = require('express');
const { handleRestfulError } = require('../../middleware/error');
const {
  apiPostFollowedUser,
  apiDeleteFollowedUser,
} = require('../../util/api');

const router = Router();

router.post('/reader/follow/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { id } = req.params;
    try {
      await apiPostFollowedUser(id, req);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          res.sendStatus(404);
          return;
        }
      }
      next(err);
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

router.delete('/reader/follow/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(401);
      return;
    }
    const { id } = req.params;
    try {
      await apiDeleteFollowedUser(id, req);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          res.sendStatus(404);
          return;
        }
      }
      next(err);
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    handleRestfulError(req, res, next, err);
  }
});

module.exports = router;

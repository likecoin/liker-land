const { Router } = require('express');
const { FieldValue, userCollection } = require('../../util/firebase');
const {
  apiPostFollowedUser,
  apiDeleteFollowedUser,
} = require('../../util/api');

const router = Router();

router.post('/reader/follow/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
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
    const userRef = userCollection.doc(req.session.user);
    await userRef.update({
      unfollowedUsers: FieldValue.arrayRemove(id),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete('/reader/follow/user/:id', async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.sendStatus(403);
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
    const userRef = userCollection.doc(req.session.user);
    await userRef.update({
      followedUsers: FieldValue.arrayRemove(id),
    });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

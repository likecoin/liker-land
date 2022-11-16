const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const {
  authenticateV2Login,
  checkParamWalletMatch,
} = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/auth');
const { sendEmail } = require('../../../../modules/sendgrid');

const {
  VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS,
} = require('../../../constant');
const { EXTERNAL_URL } = require('../../../../config/config');

const router = Router();

router.post(
  '/:wallet/email',
  authenticateV2Login,
  checkParamWalletMatch,
  async (req, res) => {
    try {
      const { wallet: user } = req.params;
      const { email } = req.query;
      if (!email) {
        res.status(400).send('MISSING_EMAIL');
        return;
      }
      const token = uuidv4();
      await db.runTransaction(async t => {
        const userRef = walletUserCollection.doc(user);
        const userDoc = await t.get(userRef);
        const { email: currentEmail, emailLastUpdatedTs } = userDoc.data();
        if (email === currentEmail) {
          throw new Error('EMAIL_ALREADY_UPDATED');
        }
        if (
          emailLastUpdatedTs &&
          Date.now() - emailLastUpdatedTs.toMillis() <
            VERIFICATION_EMAIL_RESEND_COOLDOWN_IN_MS
        ) {
          throw new Error('EMAIL_UPDATE_IN_COOLDOWN');
        }

        await t.update(userRef, {
          emailUnconfirmed: email,
          emailVerifyToken: token,
          emailLastUpdatedTs: FieldValue.serverTimestamp(),
        });
      });
      const confirmLink = `${EXTERNAL_URL}/api/v2/users/${user}/email?token=${token}`;
      await sendEmail({
        email,
        subject: 'Confirm your email in Liker.Land',
        html: `Please click the link to confirm your email: ${confirmLink}`,
      });
      res.sendStatus(200);
    } catch (error) {
      switch (error.message) {
        case 'EMAIL_ALREADY_UPDATED':
          res.status(409).send('EMAIL_ALREADY_UPDATED');
          break;
        case 'EMAIL_UPDATE_IN_COOLDOWN':
          res.status(429).send('EMAIL_UPDATE_IN_COOLDOWN');
          break;
        default:
          handleRestfulError(req, res, next, err);
      }
    }
  }
);

router.get('/:wallet/email', async (req, res) => {
  try {
    const { wallet: user } = req.params;
    const { token } = req.query;
    if (!token) {
      res.status(400).send('MISSING_TOKEN');
      return;
    }
    const email = await db.runTransaction(async t => {
      const userRef = walletUserCollection.doc(user);
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) {
        throw new Error('USER_NOT_FOUND');
      }
      const { emailUnconfirmed, emailVerifyToken } = userDoc.data();
      if (emailVerifyToken !== token) {
        throw new Error('INVALID_TOKEN');
      }
      await t.update(userRef, {
        email: emailUnconfirmed,
        emailUnconfirmed: FieldValue.delete(),
        emailVerifyToken: FieldValue.delete(),
      });
      return emailUnconfirmed;
    });
    res.sendStatus(200);
  } catch (error) {
    switch (error.message) {
      case 'USER_NOT_FOUND':
        res.status(404).send('USER_NOT_FOUND');
        break;
      case 'INVALID_ID':
        res.status(400).send('INVALID_ID');
        break;
      default:
        handleRestfulError(req, res, next, err);
    }
  }
});

module.exports = router;

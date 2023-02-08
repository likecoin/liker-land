const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const { getBasicTemplate } = require('@likecoin/edm');
const {
  db,
  FieldValue,
  walletUserCollection,
} = require('../../../../modules/firebase');
const {
  authenticateV2Login,
  checkParamWalletMatch,
} = require('../../../middleware/auth');
const { handleRestfulError } = require('../../../middleware/error');
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
  async (req, res, next) => {
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
      const verificationURL = `${EXTERNAL_URL}/settings/email/verify/${token}`;
      const { subject, body } = getBasicTemplate({
        subject: 'Verify your email',
        content: `<p>Please click the link to verify your email:</p><p>${verificationURL}</p>`,
      });
      await sendEmail({
        email,
        subject,
        html: body,
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
          handleRestfulError(req, res, next, error);
      }
    }
  }
);

router.put('/:wallet/email', async (req, res, next) => {
  try {
    const { wallet: user } = req.params;
    const { token } = req.query;
    if (!token) {
      res.status(400).send('MISSING_TOKEN');
      return;
    }
    await db.runTransaction(async t => {
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
        notification: {
          transfer: true,
        },
      });
    });
    res.sendStatus(200);
  } catch (error) {
    switch (error.message) {
      case 'USER_NOT_FOUND':
        res.status(404).send('USER_NOT_FOUND');
        break;
      case 'INVALID_TOKEN':
        res.status(400).send('INVALID_TOKEN');
        break;
      default:
        handleRestfulError(req, res, next, error);
    }
  }
});

module.exports = router;
